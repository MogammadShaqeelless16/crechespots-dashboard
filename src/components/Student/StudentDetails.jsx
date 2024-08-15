// StudentDetails.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Style/StudentDetails.css'; // Import the CSS file for styling

const StudentDetails = ({ student, onClose, onStudentUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [studentData, setStudentData] = useState(student);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`https://shaqeel.wordifysites.com/wp-json/wp/v2/student/${student.id}`, studentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditing(false);
      onStudentUpdated();
    } catch (err) {
      console.error('Update Error:', err);
    }
  };

  return (
    <div className="student-details-overlay">
      <div className="student-details-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Student Details</h2>
        {editing ? (
          <div>
            <label>
              Full Name:
              <input
                type="text"
                name="title"
                value={studentData.title.rendered}
                onChange={handleChange}
              />
            </label>
            <label>
              Creche:
              <input
                type="text"
                name="related_creche"
                value={studentData.related_creche}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <div>
            <p><strong>Full Name:</strong> {studentData.title.rendered}</p>
            <p><strong>Creche:</strong> {studentData.related_creche}</p>
            <button onClick={handleEdit}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
