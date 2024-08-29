// src/components/DashboardCounters.jsx
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faFileAlt, faUserTie, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { fetchCrecheCounters } from '../../supabaseOperations/counterOperations'; // Adjust the import path
import { fetchCurrentUserData } from '../../supabaseOperations/userOperations'; // Adjust the import path

const DashboardCounters = () => {
  const [counters, setCounters] = useState({
    studentsCount: 0,
    staffCount: 0,
    applicationsCount: 0,
    pendingApplicationsCount: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch current user data
        const { success, data, error } = await fetchCurrentUserData();
        if (!success) throw new Error(error);

        const { crecheIds } = data;


        if (crecheIds && crecheIds.length > 0) {
          // Fetch counters for all creches
          const data = await fetchCrecheCounters(crecheIds);
          setCounters(data);
        } else {
          console.log('No creche IDs found for the user.');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setCounters({
          studentsCount: 0,
          staffCount: 0,
          applicationsCount: 0,
          pendingApplicationsCount: 0
        });
      }
    };

    loadData();
  }, []);

  const counterStyle = {
    students: { color: '#4CAF50' },  // Green
    staff: { color: '#2196F3' },     // Blue
    applications: { color: '#FF5722' }, // Orange
    pending: { color: '#FFC107' }    // Yellow
  };

  return (
    <div className="dashboard-counters">
      <div className="counter-item" style={counterStyle.students}>
        <h3><FontAwesomeIcon icon={faUserGraduate} /> Students</h3>
        <p>{counters.studentsCount}</p>
      </div>
      <div className="counter-item" style={counterStyle.staff}>
        <h3><FontAwesomeIcon icon={faUserTie} /> Staff</h3>
        <p>{counters.staffCount}</p>
      </div>
      <div className="counter-item" style={counterStyle.applications}>
        <h3><FontAwesomeIcon icon={faFileAlt} /> New Applications</h3>
        <p>{counters.applicationsCount}</p>
      </div>
      <div className="counter-item" style={counterStyle.pending}>
        <h3><FontAwesomeIcon icon={faHourglassHalf} /> Pending Applications</h3>
        <p>{counters.pendingApplicationsCount}</p>
      </div>
    </div>
  );
};

export default DashboardCounters;
