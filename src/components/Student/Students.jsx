import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AddStudent from './AddStudent';
import StudentDetails from './StudentDetails';
import BroadcastDetails from './BroadcastDetails';
import './Style/Students.css'; // Ensure this file includes styles for icons

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
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

        const crecheTitleMap = crecheResponse.data.reduce((map, creche) => {
          if (creche.assigned_user && creche.assigned_user === userName) {
            map[creche.id] = creche.title.rendered;
          }
          return map;
        }, {});

        const studentResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/student', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = studentResponse.data.filter(student =>
          Object.values(crecheTitleMap).includes(student.related_creche)
        );

        setStudents(studentResponse.data);
        setFilteredStudents(filtered);

      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.response ? err.response.data.message : 'Failed to fetch students');
      }
    };

    fetchStudents();
  }, []);

  const exportToExcel = () => {
    if (filteredStudents.length === 0) {
      alert('No data to export');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filteredStudents.map(student => ({
      FullName: student.title.rendered,
      Creche: student.related_creche || 'N/A',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    XLSX.writeFile(wb, 'students.xlsx');
  };

  const handleAddStudentClick = () => {
    setShowAddStudent(true);
  };

  const handleCloseAddStudent = () => {
    setShowAddStudent(false);
  };

  const handleStudentAdded = () => {
    fetchStudents();
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseStudentDetails = () => {
    setSelectedStudent(null);
  };

  const handleStudentUpdated = () => {
    fetchStudents();
  };

  const handleBroadcastClick = () => {
    setShowBroadcast(true);
  };

  const handleCloseBroadcast = () => {
    setShowBroadcast(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = students.filter(student =>
      student.title.rendered.toLowerCase().includes(query) ||
      (student.related_creche && student.related_creche.toLowerCase().includes(query))
    );
    setFilteredStudents(filtered);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteOverlay(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        const token = localStorage.getItem('jwtToken');
        await axios.delete(`https://shaqeel.wordifysites.com/wp-json/wp/v2/student/${studentToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(students.filter(s => s.id !== studentToDelete.id));
        setFilteredStudents(filteredStudents.filter(s => s.id !== studentToDelete.id));
        setShowDeleteOverlay(false);
      } catch (err) {
        console.error('Delete Error:', err);
        setError('Failed to delete student');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteOverlay(false);
    setStudentToDelete(null);
  };

  return (
    <div className="students-container">
      <div className="header-container">
        <h1>My Students</h1>
        <div className="sub-header-container">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <button onClick={exportToExcel} className="export-button">
            <i className="fas fa-file-export"></i> Export to Excel
          </button>
          <button onClick={handleAddStudentClick} className="add-student-button">
            <i className="fas fa-user-plus"></i> Add Student
          </button>
          <button onClick={handleBroadcastClick} className="broadcast-button">
            <i className="fas fa-broadcast-tower"></i> Broadcast
          </button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {filteredStudents.length > 0 ? (
        <div className="student-grid">
          {filteredStudents.map(student => (
            <div key={student.id} className="student-card">
              <h3>{student.title.rendered}</h3>
              <p>Creche: {student.related_creche || 'Unknown'}</p>
              <button onClick={() => handleStudentClick(student)}>View Details</button>
              <button onClick={() => handleDeleteClick(student)} className="delete-button">Delete Student</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No students found.</p>
      )}
      {showAddStudent && (
        <AddStudent onClose={handleCloseAddStudent} onStudentAdded={handleStudentAdded} />
      )}
      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={handleCloseStudentDetails}
          onStudentUpdated={handleStudentUpdated}
        />
      )}
      {showBroadcast && (
        <BroadcastDetails onClose={handleCloseBroadcast} />
      )}
      {showDeleteOverlay && (
        <div className="overlay">
          <div className="warning-overlay">
            <p>Are you sure you want to delete {studentToDelete?.title.rendered}?</p>
            <button onClick={confirmDelete} className="confirm-delete-button">Yes, Delete</button>
            <button onClick={cancelDelete} className="cancel-delete-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
