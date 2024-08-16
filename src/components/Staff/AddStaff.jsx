import React, { useState } from 'react';
import axios from 'axios';
import './Style/AddStaff.css';

const AddStaff = ({ onClose, onStaffAdded }) => {
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [staffNumber, setStaffNumber] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    try {
      await axios.post('https://shaqeel.wordifysites.com/wp-json/wp/v2/staff', {
        title: { rendered: name },
        qualification,
        staff_number: staffNumber,
        staff_email: email,
        position,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onStaffAdded();
      onClose();
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to add staff');
    }
  };

  return (
    <div className="overlay">
      <div className="add-staff-modal">
        <h2>Add Staff Member</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Qualification:
            <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} />
          </label>
          <label>
            Staff Number:
            <input type="text" value={staffNumber} onChange={(e) => setStaffNumber(e.target.value)} />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Position:
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
          </label>
          <button type="submit">Add Staff</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
