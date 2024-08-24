import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState('');
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me?context=edit', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, first_name, last_name, email, url, description, link, locale, roles, avatar_urls } = response.data;

        // Set profile and form data
        setProfile({
          name,
          first_name,
          last_name,
          email,
          url,
          description,
          link,
          locale,
          roles,
          avatar_urls
        });

        setFormData({
          name: name || '',
          first_name: first_name || '',
          last_name: last_name || '',
          email: email || '',
          url: url || '',
          description: description || '',
          locale: locale || '',
          roles: roles ? roles.join(', ') : '', // Convert array to string for display
          avatar_urls: avatar_urls ? avatar_urls['96'] : '' // Default avatar URL
        });
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    try {
      await axios.post('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile({ ...profile, ...formData });
      setEditable(false);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to update profile');
    }
  };

  return (
    <div className="profile">
      <h1>Profile</h1>
      {error && <p className="error">{error}</p>}
      <div className="profile-details">
        {editable ? (
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="url">Website URL</label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="locale">Locale</label>
              <input
                type="text"
                id="locale"
                name="locale"
                value={formData.locale}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="roles">Roles</label>
              <input
                type="text"
                id="roles"
                name="roles"
                value={formData.roles}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="avatar_urls">Avatar URL (150px)</label>
              <input
                type="url"
                id="avatar_urls"
                name="avatar_urls"
                value={formData.avatar_urls}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditable(false)}>Cancel</button>
          </form>
        ) : (
          <>
            {profile.avatar_urls && (
              <img src={profile.avatar_urls['96']} alt={`${profile.first_name} ${profile.last_name}'s profile`} className="profile-picture" />
            )}
            <h2>{profile.name}</h2>
            <p>First Name: {profile.first_name || 'Not available'}</p>
            <p>Last Name: {profile.last_name || 'Not available'}</p>
            <p>Email: {profile.email || 'Not available'}</p>
            {profile.url && (
              <p>
                Website: <a href={profile.url} target="_blank" rel="noopener noreferrer">{profile.url}</a>
              </p>
            )}
            {profile.description && <p>Description: {profile.description}</p>}
            {profile.locale && <p>Locale: {profile.locale}</p>}
            {profile.roles && <p>Roles: {profile.roles.join(', ')}</p>}
            <button onClick={() => setEditable(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
