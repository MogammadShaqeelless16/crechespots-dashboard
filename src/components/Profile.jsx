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
        const response = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          // Add other fields as necessary
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
      await axios.put('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', formData, {
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
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
                required
              />
            </div>
            {/* Add more fields as necessary */}
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditable(false)}>Cancel</button>
          </form>
        ) : (
          <>
            <h2>{profile.name}</h2>
            <p>Username: {profile.username}</p> {/* Display the username */}
            <p>Email: {profile.email}</p>
            {/* Display more profile fields */}
            <button onClick={() => setEditable(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
