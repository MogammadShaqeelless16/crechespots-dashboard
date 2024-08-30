import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient';
import { fetchCurrentUserData } from '../../supabaseOperations/userOperations';
import ApplicationDetails from './ApplicationDetails';
import AddApplication from './AddApplication';
import BroadcastDetails from '../Student/BroadcastDetails';
import './Style/Applications.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { success, data, error } = await fetchCurrentUserData();

        if (!success) {
          setApplications([]);
          setFilteredApplications([]);
          return;
        }

        const { crecheIds } = data;

        if (!Array.isArray(crecheIds) || crecheIds.length === 0) {
          setApplications([]);
          setFilteredApplications([]);
          return;
        }

        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select('*')
          .in('creche_id', crecheIds);

        if (applicationsError) throw new Error(applicationsError.message);

        if (Array.isArray(applicationsData)) {
          setApplications(applicationsData);
          setFilteredApplications(applicationsData);
        } else {
          setApplications([]);
          setFilteredApplications([]);
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to fetch applications');
      }
    };

    fetchApplications();
  }, []);

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

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ application_status: newStatus })
        .eq('id', applicationId)
        .select('*')
        .single();

      if (error) throw error;

      setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, application_status: newStatus } : app
      ));
      setFilteredApplications(filteredApplications.map(app =>
        app.id === applicationId ? { ...app, application_status: newStatus } : app
      ));
    } catch (err) {
      console.error('Status Update Error:', err);
      setError('Failed to update application status');
    }
  };

  const handleBroadcastClick = () => {
    setShowBroadcast(true);
  };

  const handleCloseBroadcast = () => {
    setShowBroadcast(false);
  };

  const handleMakeStudent = async (application) => {
    try {
      // Insert application data into the students table
      const { error: insertError } = await supabase
        .from('students')
        .insert([{
          // Map application fields to student fields as necessary
          parent_name: application.parent_name, // Example mapping
          parent_phone_number: application.parent_phone_number,
          parent_email: application.parent_email,
          address: application.parent_address,
          creche_id: application.creche_id,
          created_at: new Date().toISOString(), // Assuming you want to track when the student was created
        }]);

      if (insertError) throw insertError;

      // Delete the application from the applications table
      const { error: deleteError } = await supabase
        .from('applications')
        .delete()
        .eq('id', application.id);

      if (deleteError) throw deleteError;

      // Update state to remove the application
      setApplications(applications.filter(app => app.id !== application.id));
      setFilteredApplications(filteredApplications.filter(app => app.id !== application.id));
    } catch (err) {
      console.error('Make Student Error:', err);
      setError('Failed to create student');
    }
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
      <h1>Applications</h1>
      <div className="header-container">
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
      <table className="application-table">
        <thead>
          <tr>
            <th>Application Source</th>
            <th>Parent's Name</th>
            <th>Parent's Phone Number</th>
            <th>Parent's Email</th>
            <th>Message</th>
            <th>Application Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.length > 0 ? (
            filteredApplications.map(application => (
              <tr key={application.id}>
                <td>{application.source}</td>
                <td>{application.parent_name}</td>
                <td>{application.parent_phone_number}</td>
                <td>{application.parent_email}</td>
                <td>{application.message}</td>
                <td>{application.created_at}</td>
                <td>{application.application_status || 'New'}</td>
                <td className="application-actions">
                  <button onClick={() => handleApplicationClick(application)} className="view-button">
                    <i className="fas fa-eye"></i> View
                  </button>
                  {application.application_status === 'Approved' && (
                    <button onClick={() => handleMakeStudent(application)} className="make-student-button">
                      <i className="fas fa-user-plus"></i> Make Student
                    </button>
                  )}
                  <button onClick={() => {
                    setApplicationToDelete(application);
                    setShowDeleteOverlay(true);
                  }} className="delete-button">
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No applications found.</td>
            </tr>
          )}
        </tbody>
      </table>
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
            <button onClick={confirmDelete} className="confirm-delete-button">
              Yes, Delete
            </button>
            <button onClick={cancelDelete} className="cancel-delete-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
