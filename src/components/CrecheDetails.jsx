import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Ensure this import if not already included
import { supabase } from '../supabaseOperations/supabaseClient'; // Adjust the path as needed
import './CrecheDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faGlobe, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const CrecheDetails = () => {
  const { id } = useParams(); // Ensure you have the correct route params
  const [creche, setCreche] = useState(null);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCreche = async () => {
      try {
        const { data, error } = await supabase
          .from('creches') // Replace 'creches' with your actual table name
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setCreche(data);
        setFormData({
          name: data.name || '',
          address: data.address || '',
          phoneNumber: data.phone_number || '',
          email: data.email || '',
          capacity: data.capacity || '',
          operatingHours: data.operating_hours || '',
          website: data.website_url || '',
          description: data.description || '',
          registered: data.registered || '',
          facebook: data.facebook_url || '',
          twitter: data.twitter_url || '',
          instagram: data.instagram_url || '',
          linkedin: data.linkedin_url || '',
          whatsapp: data.whatsapp_number || '',
          telegram: data.telegram_number || '',
          price: data.price || '',
          headerImage: data.header_image || '',
          logo: data.logo || '' // Added logo to formData
        });
      } catch (err) {
        setError('Failed to fetch creche details');
        console.error('Error fetching creche details:', err);
      }
    };

    fetchCreche();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
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
    setError('');
    setSuccess('');
  
    try {
      const { error } = await supabase
        .from('creches') // Replace 'creches' with your actual table name
        .update({
          name: formData.name,
          address: formData.address,
          phone_number: formData.phoneNumber,
          email: formData.email,
          capacity: formData.capacity,
          operating_hours: formData.operatingHours,
          website_url: formData.website,
          description: formData.description,
          registered: formData.registered,
          facebook_url: formData.facebook,
          twitter_url: formData.twitter,
          instagram_url: formData.instagram,
          linkedin_url: formData.linkedin,
          whatsapp_number: formData.whatsapp,
          telegram_number: formData.telegram,
          price: formData.price,
          header_image: formData.headerImage,
          logo: formData.logo
        })
        .eq('id', id);
  
      if (error) {
        throw error;
      }
  
      setCreche({ ...creche, ...formData });
      setSuccess('Creche details updated successfully!');
      setEditable(false);
    } catch (err) {
      setError(`Failed to update creche details: ${err.message}`);
      console.error('Error updating creche details:', err);
    }
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const handleCancel = () => {
    setEditable(false);
    if (creche) {
      setFormData({
        name: creche.name || '',
        address: creche.address || '',
        phoneNumber: creche.phone_number || '',
        email: creche.email || '',
        capacity: creche.capacity || '',
        operatingHours: creche.operating_hours || '',
        website: creche.website_url || '',
        description: creche.description || '',
        registered: creche.registered || '',
        facebook: creche.facebook_url || '',
        twitter: creche.twitter_url || '',
        instagram: creche.instagram_url || '',
        linkedin: creche.linkedin_url || '',
        whatsapp: creche.whatsapp_number || '',
        telegram: creche.telegram_number || '',
        price: creche.price || '',
        headerImage: creche.header_image || '',
        logo: creche.logo || '' // Added logo to formData
      });
    }
  };

  const handleContact = () => {
    const subject = `Inquiry about ${formData.name}`;
    window.location.href = `mailto:support@crechespots.co.za?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="creche-details">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {creche === null ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="details-container">
          <div className="form-container">
            <h1>{formData.name}</h1>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="description">Description</label>
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
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="operatingHours">Operating Hours</label>
                <input
                  type="text"
                  id="operatingHours"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">Website URL</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
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
                <label htmlFor="twitter">Twitter</label>
                <input
                  type="text"
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
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
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  type="text"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
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
                <label htmlFor="telegram">Telegram</label>
                <input
                  type="text"
                  id="telegram"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
              {editable && (
                <div className="form-group">
                  <button type="submit">
                    <FontAwesomeIcon icon={faSave} /> Save
                  </button>
                  <button type="button" onClick={handleCancel}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
          {!editable && (
            <div className="action-buttons-container">
              <div className="action-buttons">
                <button type="button" onClick={handleEdit}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => window.open(formData.website, '_blank')}
                >
                  <FontAwesomeIcon icon={faGlobe} /> Website
                </button>
                <button type="button" onClick={handleContact}>
                  <FontAwesomeIcon icon={faEnvelope} /> Contact
                </button>
              </div>
              <div className="images-container">
                <div className="logo-container">
                  <h3>Logo</h3>
                  <img src={formData.logo} alt="Logo" className="logo-image" />
                </div>
                <div className="header-image-container">
                  <img src={formData.headerImage} alt="Header" className="header-image" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CrecheDetails;
