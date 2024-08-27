// src/AddApplication.js
import React, { useState } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient';
import './Style/AddApplication.css'; // Ensure this file contains the styles for the overlay

const AddApplication = ({ onClose, onApplicationAdded }) => {
  const [title, setTitle] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('New');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleAddApplication = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('applications')
        .insert([{
          title,
          parent_name: parentName,
          parent_phone_number: parentPhoneNumber,
          parent_email: parentEmail,
          parent_address: parentAddress,
          number_of_children: numberOfChildren,
          application_status: applicationStatus,
          application_description: description,
          created_at: new Date().toISOString() // Assuming you want to track when the application was created
        }]);
        
      if (error) throw error;

      // Optionally, you can fetch the new application details here
      onApplicationAdded({
        title,
        parent_name: parentName,
        parent_phone_number: parentPhoneNumber,
        parent_email: parentEmail,
        parent_address: parentAddress,
        number_of_children: numberOfChildren,
        application_status: applicationStatus,
        application_description: description,
      });
      onClose();
    } catch (err) {
      console.error('Add Error:', err);
      setError(err.message || 'Failed to add application');
    }
  };

  return (
    <div className="overlay active">
      <div className="add-application-container">
        <button onClick={onClose} className="close-button">×</button>
        <form onSubmit={handleAddApplication} className="add-application-form">
          <h2>Add Application</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            placeholder="Application Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Parent's Name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Parent's Phone Number"
            value={parentPhoneNumber}
            onChange={(e) => setParentPhoneNumber(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Parent's Email"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Parent's Address"
            value={parentAddress}
            onChange={(e) => setParentAddress(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Number of Children"
            value={numberOfChildren}
            onChange={(e) => setNumberOfChildren(e.target.value)}
            required
          />
          <select
            value={applicationStatus}
            onChange={(e) => setApplicationStatus(e.target.value)}
            required
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="form-actions">
            <button type="submit" className="submit-button">Add Application</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplication;
