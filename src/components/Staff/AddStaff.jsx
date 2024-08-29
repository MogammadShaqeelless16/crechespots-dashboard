import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient'; // Adjust import path
import { fetchCurrentUserData } from '../../supabaseOperations/userOperations'; // Adjust import path
import './Style/AddStaff.css';

const AddStaff = ({ onClose, onStaffAdded }) => {
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [staffNumber, setStaffNumber] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [crecheId, setCrecheId] = useState('');

  useEffect(() => {
    const fetchCrecheId = async () => {
      try {
        const { success, data, error } = await fetchCurrentUserData();

        if (!success) {
          console.warn('Failed to fetch user data:', error);
          setError('Failed to fetch creche data');
          return;
        }

        const { crecheIds } = data;

        if (crecheIds && crecheIds.length > 0) {
          setCrecheId(crecheIds[0]); // Assuming the user is associated with one creche
        } else {
          setError('No creche found for the current user.');
        }
      } catch (err) {
        console.error('Error fetching creche ID:', err);
        setError('Error fetching creche ID');
      }
    };

    fetchCrecheId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!crecheId) {
      setError('No creche ID available for staff addition.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('staff')
        .insert([{
          name,
          qualification,
          staff_number: staffNumber,
          email,
          position,
          creche_id: crecheId,
        }]);

      if (error) throw new Error(error.message);

      console.log('Staff added successfully:', data[0]);
      onStaffAdded();  // Notify parent component
      onClose();       // Close the modal
    } catch (err) {
      setError(err.message || 'Failed to add staff');
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
