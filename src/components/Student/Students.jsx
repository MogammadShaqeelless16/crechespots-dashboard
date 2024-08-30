import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import AddStudent from './AddStudent';
import StudentDetails from './StudentDetails';
import BroadcastDetails from './BroadcastDetails';
import { supabase } from '../../supabaseOperations/supabaseClient';
import { fetchCurrentUserData } from '../../supabaseOperations/userOperations';
import './Style/Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const { success, data, error } = await fetchCurrentUserData();

        if (!success) {
          setStudents([]);
          setFilteredStudents([]);
          return;
        }

        const { crecheIds } = data;

        if (!Array.isArray(crecheIds) || crecheIds.length === 0) {
          setStudents([]);
          setFilteredStudents([]);
          return;
        }

        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .in('creche_id', crecheIds);

        if (studentsError) throw new Error(studentsError.message);

        if (Array.isArray(studentsData)) {
          setStudents(studentsData);
          setFilteredStudents(studentsData);
        } else {
          setStudents([]);
          setFilteredStudents([]);
        }
      } catch (error) {
        console.error('Error fetching students data:', error);
      }
    };

    loadStudentData();
  }, []);

  const exportToExcel = () => {
    if (filteredStudents.length === 0) {
      alert('No data to export');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filteredStudents.map(student => ({
      Name: student.name || 'N/A',
      DOB: student.dob || 'N/A',
      ParentName: student.parent_name || 'N/A',
      ParentPhoneNumber: student.parent_phone_number || 'N/A',
      ParentEmail: student.parent_email || 'N/A',
      FeesOwed: student.fees_owed || '0',
      FeesPaid: student.fees_paid || '0',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students Report');

    XLSX.writeFile(wb, 'students_report.xlsx');
  };

  const handleAddStudentClick = () => {
    setShowAddStudent(true);
  };

  const handleCloseAddStudent = () => {
    setShowAddStudent(false);
  };

  const handleStudentAdded = async (newStudent) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([newStudent]);

      if (error) throw new Error(error.message);

      setStudents(prev => [...prev, data[0]]);
      setFilteredStudents(prev => [...prev, data[0]]);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };

  const handleCloseStudentDetails = () => {
    setShowStudentDetails(false);
    setSelectedStudent(null);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteOverlay(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .match({ id: studentToDelete.id });

        if (error) throw new Error(error.message);

        setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
        setFilteredStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
        setShowDeleteOverlay(false);
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteOverlay(false);
    setStudentToDelete(null);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(query) ||
      (student.parent_name && student.parent_name.toLowerCase().includes(query))
    );
    setFilteredStudents(filtered);
  };

  const handleBroadcastClick = () => {
    setShowBroadcast(true);
  };

  const handleCloseBroadcast = () => {
    setShowBroadcast(false);
  };

  return (
    <div className="students-container">
      <h1>Student List</h1>
      <div className="students-actions">
        <button onClick={handleAddStudentClick}>Add Student</button>
        <button onClick={exportToExcel}>Export</button>
        <button onClick={handleBroadcastClick}>Broadcast</button>
        <input
          type="text"
          placeholder="Search by name or parent name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Parent Name</th>
            <th>Parent Phone Number</th>
            <th>Fees Owed</th>
            <th>Fees Paid</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.dob}</td>
              <td>{student.parent_name}</td>
              <td>{student.parent_phone_number}</td>
              <td>R {student.fees_owed || 'N/A'}</td>
              <td>R {student.fees_paid || 'N/A'}</td>
              <td>
                <button onClick={() => handleViewDetails(student)}>View Details</button>
                <button onClick={() => handleDeleteClick(student)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddStudent && (
        <AddStudent
          onClose={handleCloseAddStudent}
          onStudentAdded={handleStudentAdded}
        />
      )}

      {showStudentDetails && selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={handleCloseStudentDetails}
          onStudentUpdated={() => setSelectedStudent(null)} // Optionally trigger an update
        />
      )}

      {showDeleteOverlay && (
        <div className="delete-overlay">
          <div className="delete-confirmation">
            <h3>Are you sure you want to delete this student?</h3>
            <div className="delete-actions">
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}

      {showBroadcast && (
        <BroadcastDetails
          onClose={handleCloseBroadcast}
        />
      )}
    </div>
  );
};

export default Students;
