import React, { useState } from 'react';
import './Style/ApplicationDetails.css'; // Ensure this file contains the styles for the overlay

const ApplicationDetails = ({ application, onClose, onUpdate = () => {} }) => {
  const [selectedStatus, setSelectedStatus] = useState(application.application_status || 'New');

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleUpdateStatus = () => {
    // Pass the updated status back to the parent component
    if (typeof onUpdate === 'function') {
      onUpdate(application.id, selectedStatus);
    }
  };

  if (!application) return null; // Prevent rendering if no application is selected

  return (
    <div className={`overlay ${application ? 'active' : ''}`}>
      <div className="application-details">
        <button onClick={onClose} className="close-button">×</button>
        <h2>Application Details</h2>
        <p><strong>ID:</strong> {application.id}</p>
        <p><strong>Title:</strong> {application.title.rendered}</p>
        <p><strong>Parent's Name:</strong> {application.parent_name}</p>
        <p><strong>Parent's Phone Number:</strong> {application.parent_phone_number}</p>
        <p><strong>Parent's Email:</strong> {application.parent_email}</p>
        <p><strong>Parent's Address:</strong> {application.parent_address}</p>
        <p><strong>Number of Children:</strong> {application.number_of_children}</p>
        <p><strong>Status:</strong> {application.application_status || 'New'}</p>
        <p><strong>Description:</strong> {application.description}</p>
        <div className="status-update">
          <label htmlFor="status">Update Status:</label>
          <select
            id="status"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="update-container">
            <button onClick={handleUpdateStatus} className="update-button">Update Status</button>
            <button onClick={onClose} className="close-button">×</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
