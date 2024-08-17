import React, { useContext, useState } from 'react';
import * as XLSX from 'xlsx';
import AddStaff from './AddStaff';
import StaffDetails from './StaffDetails';
import BroadcastDetails from '../Student/BroadcastDetails';
import { DataContext } from '../../Context/DataContext';
import './Style/Staff.css';

const Staff = () => {
  const { staff, error, setStaff } = useContext(DataContext);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStaff, setFilteredStaff] = useState(staff);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);

  const exportToExcel = () => {
    if (filteredStaff.length === 0) {
      alert('No data to export');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filteredStaff.map(member => ({
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
    // Optionally, you could refresh the staff data here if needed
  };

  const handleViewDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowStaffDetails(true);
  };

  const handleCloseStaffDetails = () => {
    setShowStaffDetails(false);
    setSelectedStaff(null);
  };

  const handleDeleteClick = (staffMember) => {
    setStaffToDelete(staffMember);
    setShowDeleteOverlay(true);
  };

  const confirmDelete = () => {
    if (staffToDelete) {
      // Logic for deleting the staff member
      setStaff(staff.filter(member => member.id !== staffToDelete.id));
      setFilteredStaff(filteredStaff.filter(member => member.id !== staffToDelete.id));
      setShowDeleteOverlay(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteOverlay(false);
    setStaffToDelete(null);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = staff.filter(member =>
      member.title.rendered.toLowerCase().includes(query) ||
      (member.position && member.position.toLowerCase().includes(query))
    );
    setFilteredStaff(filtered);
  };

  const handleBroadcastClick = () => {
    setShowBroadcast(true);
  };

  const handleCloseBroadcast = () => {
    setShowBroadcast(false);
  };

  return (
    <div className="staff">
      <div className="header-container">
        <h1>Staff</h1>
        <div className="sub-header-container">
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <button onClick={exportToExcel} className="export-button">
            <i className="fas fa-file-export"></i> Export Staff Report
          </button>
          <button onClick={handleAddStaffClick} className="add-staff-button">
            <i className="fas fa-user-plus"></i> Add Staff
          </button>
          <button onClick={handleBroadcastClick} className="broadcast-button">
            <i className="fas fa-broadcast-tower"></i> Broadcast
          </button>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="staff-grid">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((staffMember) => (
            <div key={staffMember.id} className="staff-card">
              <h2>{staffMember.title.rendered || 'No Name Provided'}</h2>
              <p><strong>Qualification:</strong> {staffMember.qualification || 'Not Specified'}</p>
              <p><strong>Staff Number:</strong> {staffMember.staff_number || 'Not Specified'}</p>
              <p><strong>Email:</strong> {staffMember.staff_email || 'Not Specified'}</p>
              <p><strong>Position:</strong> {staffMember.position || 'Not Specified'}</p>
              <button onClick={() => handleViewDetails(staffMember)}>View Details</button>
              <button onClick={() => handleDeleteClick(staffMember)} className="delete-button">Delete Staff</button>
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
          onUpdate={() => setStaff()} // Assuming you would update the staff data here
        />
      )}
      {showBroadcast && (
        <BroadcastDetails onClose={handleCloseBroadcast} />
      )}
      {showDeleteOverlay && (
        <div className="overlay">
          <div className="warning-overlay">
            <p>Are you sure you want to delete {staffToDelete?.title.rendered}?</p>
            <button onClick={confirmDelete} className="confirm-delete-button">Yes, Delete</button>
            <button onClick={cancelDelete} className="cancel-delete-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
