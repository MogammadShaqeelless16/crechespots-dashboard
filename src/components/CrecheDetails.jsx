import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles
import './CrecheDetails.css';
import SplashScreen from './SplashScreen/SplashScreen';

const CrecheDetails = () => {
  const { id } = useParams();
  const [creche, setCreche] = useState(null);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCreche = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get(`https://shaqeel.wordifysites.com/wp-json/wp/v2/creche/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const postSlug = response.data.slug; // Getting the post slug
        setCreche(response.data);
        setFormData({
          title: response.data.title.rendered || '',
          description: response.data.content.rendered || '',
          price: response.data.price || '',
          phoneNumber: response.data.phone_number || '',
          email: response.data.email || '',
          address: response.data.address || '',
          headerImage: response.data.header_image || '',
          logo: response.data.logo || '',
          maxStudents: response.data.max_students || '',
          whatsapp: response.data.whatsapp || '',
          user: response.data.user || '',
          latitude: response.data.latitude || '',
          longitude: response.data.longitude || '',
          facebook: response.data.facebook || '',
          instagram: response.data.instagram || '',
          postSlug: postSlug // Save the slug for later use
        });
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Failed to fetch creche details');
      }
    };

    fetchCreche();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditorChange = (value) => {
    setFormData(prevData => ({
      ...prevData,
      description: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.put(`https://shaqeel.wordifysites.com/wp-json/wp/v2/creche/${id}`, {
        ...formData,
        content: formData.description, // For the 'content' field in WP
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setCreche(response.data);
      setSuccess('Creche details updated successfully!');
      setEditable(false);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to update creche details');
    }
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const handleCancel = () => {
    setEditable(false);
    setFormData({
      title: creche.title.rendered || '',
      description: creche.content.rendered || '',
      price: creche.price || '',
      phoneNumber: creche.phone_number || '',
      email: creche.email || '',
      address: creche.address || '',
      headerImage: creche.header_image || '',
      logo: creche.logo || '',
      maxStudents: creche.max_students || '',
      whatsapp: creche.whatsapp || '',
      user: creche.user || '',
      latitude: creche.latitude || '',
      longitude: creche.longitude || '',
      facebook: creche.facebook || '',
      instagram: creche.instagram || '',
      postSlug: creche.slug || '' // Set the slug from the fetched data
    });
  };

  return (
    <div className="creche-details">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {creche ? (
        <div className="details-container">
          <div className="form-container">
            <h1>{formData.title}</h1>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <ReactQuill
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleEditorChange}
                  readOnly={!editable}
                  theme={editable ? 'snow' : 'bubble'}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  readOnly={!editable}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  readOnly={!editable}
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
                  readOnly={!editable}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="headerImage">Header Image URL</label>
                <input
                  type="text"
                  id="headerImage"
                  name="headerImage"
                  value={formData.headerImage}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="logo">Logo URL</label>
                <input
                  type="text"
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="maxStudents">Max Students</label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="user">User</label>
                <input
                  type="text"
                  id="user"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="latitude">Latitude</label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="longitude">Longitude</label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="facebook">Facebook</label>
                <input
                  type="text"
                  id="facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="instagram">Instagram</label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
            </form>
          </div>
          <div className="action-buttons-container">
            <div className="action-buttons">
              {editable ? (
                <>
                  <button type="button" onClick={handleSave}>Save</button>
                  <button type="button" onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={handleEdit}>Edit</button>
                  <button
                    type="button"
                    onClick={() => window.open(`https://shaqeel.wordifysites.com/${formData.postSlug}`, '_blank')}
                  >
                    Website
                  </button>
                  <button type="button" onClick={() => window.open(`mailto:${formData.email}`)}>Contact</button>
                </>
              )}
            </div>
            <div className="images-container">
              <div className="logo-container">
                <h3>Logo</h3>
                <img src={formData.logo} alt="Logo" className="logo-image" />
                <p>Heading Image</p>
              </div>
              <div className="header-image-container">
                <img src={formData.headerImage} alt="Header" className="header-image" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SplashScreen/>
      )}
    </div>
  );
};

export default CrecheDetails;
