import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AddStudent from './AddStudent'; // Import the AddStudent component
import StudentDetails from './StudentDetails'; // Import the StudentDetails component
import './Style/Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      try {
        // Fetch the user's profile to get the user's name
        const profileResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userName = profileResponse.data.name;

        // Fetch creches assigned to this user
        const crecheResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/creche', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Create a mapping of creche IDs to titles
        const crecheTitleMap = crecheResponse.data.reduce((map, creche) => {
          if (creche.assigned_user && creche.assigned_user === userName) {
            map[creche.id] = creche.title.rendered;
          }
          return map;
        }, {});

        // Fetch students
        const studentResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/student', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter students based on related_creche title matching the user's creches
        const filtered = studentResponse.data.filter(student =>
          Object.values(crecheTitleMap).includes(student.related_creche)
        );

        setStudents(studentResponse.data); // Set all students
        setFilteredStudents(filtered); // Set filtered students

      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.response ? err.response.data.message : 'Failed to fetch students');
      }
    };

    fetchStudents();
  }, []);

  // Export students data to Excel
  const exportToExcel = () => {
    if (filteredStudents.length === 0) {
      alert('No data to export');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filteredStudents.map(student => ({
      FullName: student.title.rendered,
      Creche: student.related_creche || 'N/A', // Adjust based on actual data
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
    // Refresh the student list when a student is added
    fetchStudents();
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseStudentDetails = () => {
    setSelectedStudent(null);
  };

  const handleStudentUpdated = () => {
    // Refresh the student list when a student is updated
    fetchStudents();
  };

  return (
    <div className="students-container">
      <div className="header-container">
        <h1>My Students</h1>
        <button onClick={exportToExcel} className="export-button">Export to Excel</button>
        <button onClick={handleAddStudentClick} className="add-student-button">Add Student</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {filteredStudents.length > 0 ? (
        <ul className="student-list">
          {filteredStudents.map(student => (
            <li key={student.id} className="student-item" onClick={() => handleStudentClick(student)}>
              <h3>{student.title.rendered}</h3>
              <p>Creche: {student.related_creche || 'Unknown'}</p>
            </li>
          ))}
        </ul>
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
    </div>
  );
};

export default Students;
