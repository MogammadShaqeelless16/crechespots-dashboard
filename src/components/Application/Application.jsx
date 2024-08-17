import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      try {
        const profileResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userName = profileResponse.data.name;

        const crecheResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/creche', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userCreches = crecheResponse.data.filter(creche =>
          creche.assigned_user === userName
        );

        setCreches(userCreches);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.response ? err.response.data.message : 'Failed to fetch creches');
      }
    };

    fetchCreches();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      try {
        const response = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/application', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredApplications = response.data.filter(application =>
          creches.some(creche => creche.title.rendered === application.related_creche)
        );

        setApplications(filteredApplications);
        setFilteredApplications(filteredApplications);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.response ? err.response.data.message : 'Failed to fetch applications');
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
      application.title.rendered.toLowerCase().includes(query) ||
      (application.application_status && application.application_status.toLowerCase().includes(query))
    );
    setFilteredApplications(filtered);
  };

  const handleDeleteApplication = async (applicationId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No authentication token found.');
      return;
    }

    try {
      await axios.delete(`https://shaqeel.wordifysites.com/wp-json/wp/v2/application/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter(app => app.id !== applicationId));
      setFilteredApplications(filteredApplications.filter(app => app.id !== applicationId));
      setShowDeleteOverlay(false);
    } catch (err) {
      console.error('Delete Error:', err);
      setError(err.response ? err.response.data.message : 'Failed to delete application');
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
              <h3>{application.title.rendered}</h3>
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
            <p>Are you sure you want to delete {applicationToDelete?.title.rendered}?</p>
            <button onClick={confirmDelete} className="confirm-delete-button">Yes, Delete</button>
            <button onClick={cancelDelete} className="cancel-delete-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
