import React, { useState } from 'react';
import axios from 'axios';
import UserCrecheFilter from '../User/UserCrecheFilter';
import './Style/AddStudent.css';

const AddStudent = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    studentNumber: '',
    parentName: '',
    parentWhatsappNumber: '',
    parentNumber: '',
    relatedCreche: ''
  });
  const [creches, setCreches] = useState([]);
  const [error, setError] = useState('');

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No authentication token found.');
      return;
    }

    try {
      await axios.post('https://shaqeel.wordifysites.com/wp-json/wp/v2/student', {
        ...formData,
        status: 'publish'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onClose(); // Close the form on successful submission
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to add student');
    }
  };

  // Handle the loaded creches from UserCrecheFilter
  const handleCrechesLoaded = (creches) => {
    setCreches(creches);
  };

  return (
    <div className="overlay">
      <div className="form-container">
        <h2>Add Student</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Student Number:
            <input
              type="text"
              name="studentNumber"
              value={formData.studentNumber}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Parent Name:
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Parent Whatsapp Number:
            <input
              type="text"
              name="parentWhatsappNumber"
              value={formData.parentWhatsappNumber}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Parent Number:
            <input
              type="text"
              name="parentNumber"
              value={formData.parentNumber}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Related Creche:
            <select
              name="relatedCreche"
              value={formData.relatedCreche}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Creche</option>
              {creches.map(creche => (
                <option key={creche.id} value={creche.id}>
                  {creche.post_title}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
      <UserCrecheFilter onCrechesLoaded={handleCrechesLoaded} />
    </div>
  );
};

export default AddStudent;
