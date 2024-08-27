// src/Applications.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient';
import ApplicationDetails from './ApplicationDetails';
import AddApplication from './AddApplication';
import BroadcastDetails from '../Student/BroadcastDetails';
import './Style/Applications.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [error, setError] = useState('');
  const [creches, setCreches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);

  useEffect(() => {
    const fetchCreches = async () => {
      try {
        const { data: creches, error } = await supabase
          .from('creches')
          .select('*');
          
        if (error) throw error;

        // Assuming the 'assigned_user' column exists and is used for filtering
        const userName = 'YourUserName'; // Retrieve this value as needed
        const userCreches = creches.filter(creche => creche.assigned_user === userName);

        setCreches(userCreches);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to fetch creches');
      }
    };

    fetchCreches();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data: applications, error } = await supabase
          .from('applications')
          .select('*');
          
        if (error) throw error;

        const filteredApplications = applications.filter(application =>
          creches.some(creche => creche.title === application.related_creche)
        );

        setApplications(filteredApplications);
        setFilteredApplications(filteredApplications);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to fetch applications');
      }
    };

    if (creches.length > 0) {
      fetchApplications();
    }
  }, [creches]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = applications.filter(application =>
      application.title.toLowerCase().includes(query) ||
      (application.application_status && application.application_status.toLowerCase().includes(query))
    );
    setFilteredApplications(filtered);
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);
        
      if (error) throw error;

      setApplications(applications.filter(app => app.id !== applicationId));
      setFilteredApplications(filteredApplications.filter(app => app.id !== applicationId));
      setShowDeleteOverlay(false);
    } catch (err) {
      console.error('Delete Error:', err);
      setError('Failed to delete application');
    }
  };

  const handleAddApplicationClick = () => {
    setShowAddApplication(true);
  };

  const handleCloseAddApplication = () => {
    setShowAddApplication(false);
  };

  const handleApplicationAdded = (newApplication) => {
    setApplications([...applications, newApplication]);
    setFilteredApplications([...filteredApplications, newApplication]);
    setShowAddApplication(false);
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseApplicationDetails = () => {
    setSelectedApplication(null);
  };

  const handleBroadcastClick = () => {
    setShowBroadcast(true);
  };

  const handleCloseBroadcast = () => {
    setShowBroadcast(false);
  };

  const confirmDelete = () => {
    if (applicationToDelete) {
      handleDeleteApplication(applicationToDelete.id);
    }
  };

  const cancelDelete = () => {
    setShowDeleteOverlay(false);
    setApplicationToDelete(null);
  };

  return (
    <div className="applications-container">
      <div className="header-container">
        <h1>Applications</h1>
        <div className="sub-header-container">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <button onClick={handleAddApplicationClick} className="add-application-button">
            <i className="fas fa-plus"></i> Add Application
          </button>
          <button onClick={handleBroadcastClick} className="broadcast-button">
            <i className="fas fa-broadcast-tower"></i> Broadcast
          </button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="application-grid">
        {filteredApplications.length > 0 ? (
          filteredApplications.map(application => (
            <div key={application.id} className="application-item">
              <h3>{application.title}</h3>
              <p><strong>Parent's Name:</strong> {application.parent_name}</p>
              <p><strong>Parent's Phone Number:</strong> {application.parent_phone_number}</p>
              <p><strong>Parent's Email:</strong> {application.parent_email}</p>
              <p><strong>Description:</strong> {application.description}</p>
              <p><strong>Status:</strong> {application.application_status || 'New'}</p>
              <div className="application-actions">
                <button onClick={() => handleApplicationClick(application)} className="view-button">
                  <i className="fas fa-eye"></i> View Details
                </button>
                <button onClick={() => {
                  setApplicationToDelete(application);
                  setShowDeleteOverlay(true);
                }} className="delete-button">
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No applications found.</p>
        )}
      </div>
      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={handleCloseApplicationDetails}
          onUpdate={(id, newStatus) => {
            setApplications(applications.map(app =>
              app.id === id ? { ...app, application_status: newStatus } : app
            ));
            setFilteredApplications(filteredApplications.map(app =>
              app.id === id ? { ...app, application_status: newStatus } : app
            ));
          }}
        />
      )}
      {showAddApplication && (
        <AddApplication
          onClose={handleCloseAddApplication}
          onApplicationAdded={handleApplicationAdded}
        />
      )}
      {showBroadcast && (
        <BroadcastDetails onClose={handleCloseBroadcast} />
      )}
      {showDeleteOverlay && (
        <div className="overlay">
          <div className="warning-overlay">
            <p>Are you sure you want to delete {applicationToDelete?.title}?</p>
            <button onClick={confirmDelete} className="confirm-delete-button">Yes, Delete</button>
            <button onClick={cancelDelete} className="cancel-delete-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
