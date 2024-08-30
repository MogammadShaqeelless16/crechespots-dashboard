import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient';
import './Style/StudentDetails.css';

const StudentDetails = ({ student, onClose, onStudentUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('id', student.id)
          .single();

        if (error) throw new Error(error.message);

        setStudentData(data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    if (student && student.id) {
      fetchStudentDetails();
    }
  }, [student]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', student.id);

      if (error) throw new Error(error.message);

      setEditing(false);
      onStudentUpdated();
    } catch (error) {
      console.error('Error updating student details:', error);
    }
  };

  if (!studentData) {
    return (
      <div className="student-details-overlay">
        <div className="student-details-content">
          <button className="close-button" onClick={onClose}>X</button>
          <h2>Loading Student Details...</h2>
        </div>
      </div>
    );
  }

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
                name="name"
                value={studentData.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="dob"
                value={studentData.dob || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Age:
              <input
                type="text"
                name="age"
                value={studentData.age || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Class:
              <input
                type="text"
                name="class"
                value={studentData.class || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Parent's Name:
              <input
                type="text"
                name="parent_name"
                value={studentData.parent_name || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Contact:
              <input
                type="text"
                name="contact"
                value={studentData.parent_phone_number || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Disabilities/Allergies:
              <textarea
                name="disabilities_allergies"
                value={studentData.disabilities_allergies || ''}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <div>
            <p><strong>Full Name:</strong> {studentData.name}</p>
            <p><strong>Date of Birth:</strong> {studentData.dob}</p>
            <p><strong>Age:</strong> {studentData.age}</p>
            <p><strong>Class:</strong> {studentData.class}</p>
            <p><strong>Parent's Name:</strong> {studentData.parent_name}</p>
            <p><strong>Contact:</strong> {studentData.parent_phone_number}</p>
            <p><strong>Disabilities/Allergies:</strong> {studentData.disabilities_allergies}</p>
            <button onClick={handleEdit}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
