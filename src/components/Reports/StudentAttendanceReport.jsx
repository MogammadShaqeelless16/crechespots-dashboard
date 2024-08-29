import React, { useEffect, useState } from 'react';
import PieChart from './PieChart';
import StudentAttendanceTable from './StudentAttendanceTable';
import AttendanceCalendar from './AttendanceCalendar';
import { fetchMonthlyAttendanceData } from '../../supabaseOperations/attendanceOperations';

const StudentAttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [overallData, setOverallData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMonthlyAttendanceData('2024-08');
      setAttendanceData(data.students);
      setOverallData(data.overall);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Student Attendance Report</h1>
      <PieChart data={overallData} />
      <StudentAttendanceTable students={attendanceData} />
      <AttendanceCalendar attendanceData={attendanceData} />
    </div>
  );
};

export default StudentAttendanceReport;
