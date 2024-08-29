import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import AddStaff from './AddStaff';
import StaffDetails from './StaffDetails';
import BroadcastDetails from './BroadcastDetails';
import { supabase } from '../../supabaseOperations/supabaseClient';
import { fetchCurrentUserData } from '../../supabaseOperations/userOperations';
import './Style/Staff.css';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [attendanceOverlay, setAttendanceOverlay] = useState(null);

  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const { success, data, error } = await fetchCurrentUserData();

        if (!success) {
          setStaff([]);
          setFilteredStaff([]);
          return;
        }

        const { crecheIds } = data;

        if (!Array.isArray(crecheIds) || crecheIds.length === 0) {
          setStaff([]);
          setFilteredStaff([]);
          return;
        }

        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .in('creche_id', crecheIds);

        if (staffError) throw new Error(staffError.message);

        if (Array.isArray(staffData)) {
          setStaff(staffData);
          setFilteredStaff(staffData);
        } else {
          setStaff([]);
          setFilteredStaff([]);
        }
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    loadStaffData();
  }, []);

  const exportToExcel = () => {
    if (filteredStaff.length === 0) {
      alert('No data to export');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filteredStaff.map(member => ({
      Name: member.name || 'N/A',
      Qualification: member.qualification || 'N/A',
      StaffNumber: member.staff_number || 'N/A',
      Email: member.email || 'N/A',
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

  const handleStaffAdded = async (newStaff) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert([newStaff]);

      if (error) throw new Error(error.message);

      setStaff(prev => [...prev, data[0]]);
      setFilteredStaff(prev => [...prev, data[0]]);
    } catch (error) {
      console.error('Error adding staff:', error);
    }
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

  const confirmDelete = async () => {
    if (staffToDelete) {
      try {
        const { error } = await supabase
          .from('staff')
          .delete()
          .match({ id: staffToDelete.id });

        if (error) throw new Error(error.message);

        setStaff(prev => prev.filter(member => member.id !== staffToDelete.id));
        setFilteredStaff(prev => prev.filter(member => member.id !== staffToDelete.id));
        setShowDeleteOverlay(false);
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
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
      member.name.toLowerCase().includes(query) ||
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

  const handleClockIn = async (staffMember) => {
    try {
      const { data, error } = await supabase
        .from('attendance_staff')
        .insert([{
          staff_id: staffMember.id,
          date: new Date(),
          status: 'Present',
        }]);

      if (error) throw new Error(error.message);

      alert(`${staffMember.name} has been clocked in.`);
    } catch (error) {
      console.error('Error clocking in staff:', error);
    }
  };

  const handleLeaveClick = (staffMember) => {
    setAttendanceOverlay({
      staff: staffMember,
      status: 'Leave',
      leaveType: 'Sick Leave', // default selection
      remarks: ''
    });
  };

  const handleOverlaySubmit = async () => {
    const { staff, leaveType, remarks } = attendanceOverlay;
    try {
      const { data, error } = await supabase
        .from('attendance_staff')
        .insert([{
          staff_id: staff.id,
          date: new Date(),
          status: leaveType,
          remarks,
        }]);

      if (error) throw new Error(error.message);

      alert(`${staff.name} is marked as ${leaveType}.`);
      setAttendanceOverlay(null);
    } catch (error) {
      console.error('Error marking leave:', error);
    }
  };

  const handleOverlayChange = (field, value) => {
    setAttendanceOverlay(prev => ({ ...prev, [field]: value }));
  };

  const handleOverlayClose = () => {
    setAttendanceOverlay(null);
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
      <div className="staff-grid">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((staffMember) => (
            <div key={staffMember.id} className="staff-card">
              <h2>{staffMember.name || 'No Name Provided'}</h2>
              <p><strong>Qualification:</strong> {staffMember.qualification || 'Not Specified'}</p>
              <p><strong>Staff Phone Number:</strong> {staffMember.staff_number || 'Not Specified'}</p>
              <p><strong>Email:</strong> {staffMember.email || 'Not Specified'}</p>
              <p><strong>Position:</strong> {staffMember.position || 'Not Specified'}</p>
              <div className="attendance-buttons">
                <button onClick={() => handleClockIn(staffMember)} className="clock-in-button">Clock In</button>
                <button onClick={() => handleLeaveClick(staffMember)} className="leave-button">On Leave</button>
              </div>
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
        />
      )}
      {showBroadcast && (
        <BroadcastDetails onClose={handleCloseBroadcast} />
      )}
      {showDeleteOverlay && (
        <div className="overlay">
          <div className="warning-overlay">
            <p>Are you sure you want to delete {staffToDelete?.name}?</p>
            <button onClick={confirmDelete} className="confirm-delete-button">Yes, Delete</button>
            <button onClick={cancelDelete} className="cancel-delete-button">Cancel</button>
          </div>
        </div>
      )}
      {attendanceOverlay && (
        <div className="overlay">
          <div className="attendance-overlay">
            <h2>Mark {attendanceOverlay.staff.name} as {attendanceOverlay.status}</h2>
            <label>
              Leave Type:
              <select
                value={attendanceOverlay.leaveType}
                onChange={(e) => handleOverlayChange('leaveType', e.target.value)}
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
                <option value="Bereavement Leave">Bereavement Leave</option>
              </select>
            </label>
            <label>
              Remarks:
              <input
                type="text"
                value={attendanceOverlay.remarks}
                onChange={(e) => handleOverlayChange('remarks', e.target.value)}
              />
            </label>
            <button onClick={handleOverlaySubmit} className="confirm-button">Confirm</button>
            <button onClick={handleOverlayClose} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
