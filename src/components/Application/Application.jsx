import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApplicationDetails from './ApplicationDetails';
import AddApplication from './AddApplication';
import './Style/Applications.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [error, setError] = useState('');
  const [creches, setCreches] = useState([]);

  useEffect(() => {
    const fetchCreches = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      try {
        // Fetch user profile to get the username
        const profileResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userName = profileResponse.data.name;

        // Fetch all creches
        const crecheResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/creche', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter creches assigned to the current user
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

        // Filter applications based on user's creche
        const filteredApplications = response.data.filter(application =>
          creches.some(creche => creche.title.rendered === application.related_creche)
        );

        setApplications(filteredApplications);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.response ? err.response.data.message : 'Failed to fetch applications');
      }
    };

    if (creches.length > 0) {
      fetchApplications();
    }
  }, [creches]);

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
    setShowAddApplication(false);
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseApplicationDetails = () => {
    setSelectedApplication(null);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No authentication token found.');
      return;
    }

    try {
      await axios.put(`https://shaqeel.wordifysites.com/wp-json/wp/v2/application/${id}`, {
        application_status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the status in local state
      setApplications(applications.map(app =>
        app.id === id ? { ...app, application_status: newStatus } : app
      ));
    } catch (err) {
      console.error('Update Error:', err);
      setError(err.response ? err.response.data.message : 'Failed to update application status');
    }
  };

  return (
    <div className="applications-container">
      <div className="header-container">
        <h1>Applications</h1>
        <button onClick={handleAddApplicationClick} className="add-application-button">
          <i className="fas fa-plus"></i> Add Application
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {applications.length > 0 ? (
        <ul className="application-list">
          {applications.map(application => (
            <li key={application.id} className="application-item">
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
                <button onClick={() => handleDeleteApplication(application.id)} className="delete-button">
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications found.</p>
      )}
      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={handleCloseApplicationDetails}
          onUpdate={handleUpdateStatus} // Ensure this function is passed
        />
      )}
      {showAddApplication && (
        <AddApplication
          onClose={handleCloseAddApplication}
          onApplicationAdded={handleApplicationAdded}
        />
      )}
    </div>
  );
};

export default Applications;
