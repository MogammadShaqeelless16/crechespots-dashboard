// FilteredStudents.jsx
import React from 'react';

const FilteredStudents = ({ students }) => {
  return (
    <div>
      <h2>Filtered Students</h2>
      {students.length > 0 ? (
        <ul className="student-list">
          {students.map(student => (
            <li key={student.id} className="student-item">
              <h3>{student.fullName}</h3>
              <p>Student Number: {student.studentNumber}</p>
              <p>Parent Name: {student.parentName}</p>
              <p>Parent Whatsapp Number: {student.parentWhatsappNumber}</p>
              <p>Parent Number: {student.parentNumber}</p>
              <p>Creche: {student.relatedCrecheName}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No students found.</p>
      )}
    </div>
  );
};

export default FilteredStudents;
