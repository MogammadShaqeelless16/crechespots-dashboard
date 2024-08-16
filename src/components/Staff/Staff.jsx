import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AddStaff from './AddStaff'; // Import the AddStaff component
import StaffDetails from './StaffDetails'; // Import the StaffDetails component
import './Style/Staff.css';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState('');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffDetails, setShowStaffDetails] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/staff', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStaff(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Failed to fetch staff');
      }
    };

    fetchStaff();
  }, []);

  const exportToExcel = () => {
    if (staff.length === 0) {
      alert('No data to export');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(staff.map(member => ({
      Name: member.title.rendered,
      Qualification: member.qualification || 'N/A',
      StaffNumber: member.staff_number || 'N/A',
      Email: member.staff_email || 'N/A',
      Position: member.position || 'N/A',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff Report');

    XLSX.writeFile(wb, 'staff_report.xlsx');
  };

  const handleAddStaffClick = () => {
    setShowAddStaff(true);
  };

  const handleCloseAddStaff = () => {
    setShowAddStaff(false);
  };

  const handleStaffAdded = () => {
    fetchStaff(); // Refresh staff list when a new staff is added
  };

  const handleViewDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowStaffDetails(true);
  };

  const handleCloseStaffDetails = () => {
    setShowStaffDetails(false);
    setSelectedStaff(null);
  };

  return (
    <div className="staff">
      <div className="header-container">
        <h1>Staff</h1>
        <button onClick={exportToExcel} className="export-button">Export Staff Report</button>
        <button onClick={handleAddStaffClick} className="add-staff-button">Add Staff</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="staff-list">
        {staff.length > 0 ? (
          staff.map((staffMember) => (
            <div key={staffMember.id} className="staff-card" onClick={() => handleViewDetails(staffMember)}>
              <h2>{staffMember.title.rendered || 'No Name Provided'}</h2>
              <p><strong>Qualification:</strong> {staffMember.qualification || 'Not Specified'}</p>
              <p><strong>Staff Number:</strong> {staffMember.staff_number || 'Not Specified'}</p>
              <p><strong>Email:</strong> {staffMember.staff_email || 'Not Specified'}</p>
              <p><strong>Position:</strong> {staffMember.position || 'Not Specified'}</p>
            </div>
          ))
        ) : (
          <p>No staff available</p>
        )}
      </div>
      {showAddStaff && (
        <AddStaff onClose={handleCloseAddStaff} onStaffAdded={handleStaffAdded} />
      )}
      {showStaffDetails && selectedStaff && (
        <StaffDetails
          staff={selectedStaff}
          onClose={handleCloseStaffDetails}
          onUpdate={() => fetchStaff()} // Refresh staff list when details are updated
        />
      )}
    </div>
  );
};

export default Staff;
