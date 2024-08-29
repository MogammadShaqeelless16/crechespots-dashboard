import React from 'react';

const StudentAttendanceTable = ({ students }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Present</th>
          <th>Absent</th>
          <th>Late</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr key={index}>
            <td>{student.name}</td>
            <td>{student.present_days}</td>
            <td>{student.absent_days}</td>
            <td>{student.late_days}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentAttendanceTable;
