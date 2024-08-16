import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faFileAlt, faUserTie, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

const DashboardCounters = ({ studentsCount, applicationsCount, staffCount }) => {
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
        <p>{studentsCount}</p>
      </div>
      <div className="counter-item" style={counterStyle.staff}>
        <h3><FontAwesomeIcon icon={faUserTie} /> Staff</h3>
        <p>{staffCount}</p>
      </div>
      <div className="counter-item" style={counterStyle.applications}>
        <h3><FontAwesomeIcon icon={faFileAlt} /> New Applications</h3>
        <p>{applicationsCount}</p>
      </div>
      <div className="counter-item" style={counterStyle.pending}>
        <h3><FontAwesomeIcon icon={faHourglassHalf} /> Pending Applications</h3>
        <p>{applicationsCount}</p> {/* Update this to show the actual pending applications count */}
      </div>
    </div>
  );
};

export default DashboardCounters;
