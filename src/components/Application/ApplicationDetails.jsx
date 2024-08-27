// src/ApplicationDetails.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient';
import './Style/ApplicationDetails.css';

const ApplicationDetails = ({ application, onClose, onUpdate = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('New');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (application) {
      setTitle(application.title || '');
      setParentName(application.parent_name || '');
      setParentPhoneNumber(application.parent_phone_number || '');
      setParentEmail(application.parent_email || '');
      setParentAddress(application.parent_address || '');
      setNumberOfChildren(application.number_of_children || '');
      setSelectedStatus(application.application_status || 'New');
      setDescription(application.application_description || '');
    }
  }, [application]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', application.id)
        .single();
        
      if (error) throw error;
      onUpdate(data);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to fetch updated application data');
    }
  };

  const handleUpdateApplication = async () => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          title,
          parent_name: parentName,
          parent_phone_number: parentPhoneNumber,
          parent_email: parentEmail,
          parent_address: parentAddress,
          number_of_children: numberOfChildren,
          application_status: selectedStatus,
          application_description: description
        })
        .eq('id', application.id);
        
      if (error) throw error;

      await fetchApplication();
      setIsEditing(false);
    } catch (err) {
      console.error('Update Error:', err);
      setError(err.message || 'Failed to update application');
    }
  };

  if (!application) return null;

  return (
    <div className={`overlay ${application ? 'active' : ''}`}>
      <div className="application-details">
        <button onClick={onClose} className="close-button">×</button>
        <h2>Application Details</h2>
        {isEditing ? (
          <form>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Parent's Name"
            />
            <input
              type="text"
              value={parentPhoneNumber}
              onChange={(e) => setParentPhoneNumber(e.target.value)}
              placeholder="Parent's Phone Number"
            />
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="Parent's Email"
            />
            <input
              type="text"
              value={parentAddress}
              onChange={(e) => setParentAddress(e.target.value)}
              placeholder="Parent's Address"
            />
            <input
              type="number"
              value={numberOfChildren}
              onChange={(e) => setNumberOfChildren(e.target.value)}
              placeholder="Number of Children"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <div className="status-update">
              <label htmlFor="status">Update Status:</label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Decline">Decline</option>
                <option value="Accepted">Accepted</option>
              </select>
            </div>
            <div className="update-container">
              <button type="button" onClick={handleUpdateApplication} className="update-button">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <p><strong>Title:</strong> {application.title}</p>
            <p><strong>Parent's Name:</strong> {application.parent_name}</p>
            <p><strong>Parent's Phone Number:</strong> {application.parent_phone_number}</p>
            <p><strong>Parent's Email:</strong> {application.parent_email}</p>
            <p><strong>Parent's Address:</strong> {application.parent_address}</p>
            <p><strong>Number of Children:</strong> {application.number_of_children}</p>
            <p><strong>Status:</strong> {application.application_status || 'New'}</p>
            <p><strong>Description:</strong> {application.application_description}</p>
            <div className="update-container">
              <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
            </div>
          </>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ApplicationDetails;
