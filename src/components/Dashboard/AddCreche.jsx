import React, { useState } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient'; // Adjust the path as necessary

const AddCreche = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [headerImage, setHeaderImage] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add validation if needed
    if (!title) {
      setError('Title is required.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('creches')
        .insert([{ title, header_image: headerImage, assigned_user: assignedUser }]);

      if (error) {
        throw error;
      }

      // Close overlay and reset form
      onClose();
      setTitle('');
      setHeaderImage('');
      setAssignedUser('');
    } catch (error) {
      setError(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Add Creche</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="headerImage">Header Image URL</label>
            <input
              type="text"
              id="headerImage"
              value={headerImage}
              onChange={(e) => setHeaderImage(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="assignedUser">Assigned User</label>
            <input
              type="text"
              id="assignedUser"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            />
          </div>
          <button type="submit">Add Creche</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddCreche;
