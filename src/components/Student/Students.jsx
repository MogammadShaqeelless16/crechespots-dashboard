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
      Age: student.age || 'N/A',
      Class: student.class || 'N/A',
      ParentName: student.parent_name || 'N/A',
      Contact: student.contact || 'N/A',
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
      (student.class && student.class.toLowerCase().includes(query))
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
    <div className="students">
      <div className="header-container">
        <h1>Students</h1>
        <div className="sub-header-container">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <button onClick={exportToExcel} className="export-button">
            <i className="fas fa-file-export"></i> Export Students Report
          </button>
          <button onClick={handleAddStudentClick} className="add-student-button">
            <i className="fas fa-user-plus"></i> Add Student
          </button>
          <button onClick={handleBroadcastClick} className="broadcast-button">
            <i className="fas fa-broadcast-tower"></i> Broadcast
          </button>
        </div>
      </div>
      <div className="students-grid">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div key={student.id} className="student-card">
              <h2>{student.name || 'No Name Provided'}</h2>
              <p><strong>Age:</strong> {student.age || 'Not Specified'}</p>
              <p><strong>Class:</strong> {student.class || 'Not Specified'}</p>
              <p><strong>Parent's Name:</strong> {student.parent_name || 'Not Specified'}</p>
              <p><strong>Contact:</strong> {student.contact || 'Not Specified'}</p>
              <button onClick={() => handleViewDetails(student)}>View Details</button>
              <button onClick={() => handleDeleteClick(student)} className="delete-button">Delete Student</button>
            </div>
          ))
        ) : (
          <p>No students available</p>
        )}
      </div>
      {showAddStudent && (
        <AddStudent onClose={handleCloseAddStudent} onStudentAdded={handleStudentAdded} />
      )}
      {showStudentDetails && selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={handleCloseStudentDetails}
        />
      )}
      {showBroadcast && (
        <BroadcastDetails onClose={handleCloseBroadcast} />
      )}
      {showDeleteOverlay && (
        <div className="overlay">
          <div className="warning-overlay">
            <p>Are you sure you want to delete {studentToDelete?.name}?</p>
            <button onClick={confirmDelete} className="confirm-delete-button">Yes, Delete</button>
            <button onClick={cancelDelete} className="cancel-delete-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
