import React, { useState } from 'react';
import axios from 'axios';
import './Style/StaffDetails.css';

const StaffDetails = ({ staff, onClose, onUpdate }) => {
  const [name, setName] = useState(staff.title.rendered);
  const [qualification, setQualification] = useState(staff.qualification || '');
  const [staffNumber, setStaffNumber] = useState(staff.staff_number || '');
  const [email, setEmail] = useState(staff.staff_email || '');
  const [position, setPosition] = useState(staff.position || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    try {
      await axios.put(`https://shaqeel.wordifysites.com/wp-json/wp/v2/staff/${staff.id}`, {
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
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to update staff');
    }
  };

  return (
    <div className="overlay">
      <div className="staff-details-modal">
        <h2>Staff Details</h2>
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
          <button type="submit">Update Staff</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default StaffDetails;
