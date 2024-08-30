import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient';
import './Style/ApplicationDetails.css';

const ApplicationDetails = ({ application, onClose, onUpdate = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [source, setTitle] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('New');
  const [message, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (application) {
      setTitle(application.source || '');
      setParentName(application.parent_name || '');
      setParentPhoneNumber(application.parent_phone_number || '');
      setParentEmail(application.parent_email || '');
      setParentAddress(application.parent_address || '');
      setNumberOfChildren(application.number_of_children || '');
      setSelectedStatus(application.application_status || 'New');
      setDescription(application.message || '');
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
    if (!title || !parentName || !parentPhoneNumber || !parentEmail) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          source,
          parent_name: parentName,
          parent_phone_number: parentPhoneNumber,
          parent_email: parentEmail,
          parent_address: parentAddress,
          number_of_children: numberOfChildren,
          application_status: selectedStatus,
          message: message
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

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ application_status: 'Approved' })
        .eq('id', application.id);
        
      if (error) throw error;

      setSelectedStatus('Approved');
      onUpdate({ ...application, application_status: 'Approved' });
    } catch (err) {
      console.error('Approval Error:', err);
      setError('Failed to approve application');
    }
  };

  const handleDecline = async () => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ application_status: 'Declined' })
        .eq('id', application.id);
        
      if (error) throw error;

      setSelectedStatus('Declined');
      onUpdate({ ...application, application_status: 'Declined' });
    } catch (err) {
      console.error('Decline Error:', err);
      setError('Failed to decline application');
    }
  };

  if (!application) return null;

  return (
    <div className="application-details-overlay">
      <div className="application-details-container">
        <button onClick={onClose} className="close-button">×</button>
        <h2>Application Details</h2>
        {isEditing ? (
          <form className="application-details-form">
            <input
              type="text"
              value={source}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Application Source"
              required
            />
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Parent's Name"
              required
            />
            <input
              type="text"
              value={parentPhoneNumber}
              onChange={(e) => setParentPhoneNumber(e.target.value)}
              placeholder="Parent's Phone Number"
              required
            />
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="Parent's Email"
              required
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
              value={message}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="message"
            />
            <div className="form-actions">
              <button type="button" onClick={handleUpdateApplication} className="update-button">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <p><strong>Application Source:</strong> {application.source}</p>
            <p><strong>Parent's Name:</strong> {application.parent_name}</p>
            <p><strong>Parent's Phone Number:</strong> {application.parent_phone_number}</p>
            <p><strong>Parent's Email:</strong> {application.parent_email}</p>
            <p><strong>Parent's Address:</strong> {application.parent_address}</p>
            <p><strong>Number of Children:</strong> {application.number_of_children}</p>
            <p><strong>Status:</strong> {application.application_status || 'New'}</p>
            <p><strong>Message:</strong> {application.message}</p>
            <div className="form-actions">
              <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
              <button onClick={handleApprove} className="approve-button">Approve</button>
              <button onClick={handleDecline} className="decline-button">Decline</button>
            </div>
          </>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ApplicationDetails;
