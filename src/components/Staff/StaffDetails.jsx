import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient'; // Adjust import path
import './Style/StaffDetails.css';

const StaffDetails = ({ staff, onClose, onUpdate }) => {
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [staffNumber, setStaffNumber] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (staff) {
      setName(staff.name || '');
      setQualification(staff.qualification || '');
      setStaffNumber(staff.staff_number || '');
      setEmail(staff.email || '');
      setPosition(staff.position || '');
    }
  }, [staff]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!staff || !staff.id) {
      setError('Staff data is not available.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('staff')
        .update({
          name,
          qualification,
          staff_number: staffNumber,
          email,
          position,
        })
        .match({ id: staff.id });

      if (error) throw new Error(error.message);

      console.log('Staff updated successfully:', data);
      onUpdate();  // Notify parent component
      onClose();   // Close the modal
    } catch (err) {
      setError(err.message || 'Failed to update staff');
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
