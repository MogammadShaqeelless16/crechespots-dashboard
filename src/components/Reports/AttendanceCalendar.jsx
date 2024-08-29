import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const AttendanceCalendar = ({ attendanceData }) => {
  const [value, setValue] = useState(new Date());

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const attendance = attendanceData.find(d => d.attendance_date === dateString);

      if (attendance) {
        switch (attendance.status) {
          case 'Present':
            return 'tile-present';
          case 'Absent':
            return 'tile-absent';
          case 'Late':
            return 'tile-late';
          default:
            return '';
        }
      }
    }
  };

  return <Calendar value={value} onChange={setValue} tileClassName={tileClassName} />;
};

export default AttendanceCalendar;
