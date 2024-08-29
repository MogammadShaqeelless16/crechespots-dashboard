import { supabase } from '/src/supabaseOperations/supabaseClient.js'; // Assuming you're using Supabase

export const fetchMonthlyAttendanceData = async (month) => {
  try {
    const { data, error } = await supabase
      .from('attendance_students')
      .select(`
        student_id,
        attendance_date,
        status,
        students (name)
      `)
      .like('attendance_date', `${month}%`);

    if (error) {
      throw error;
    }

    // Check if there's any data
    if (data.length === 0) {
      return {
        message: 'No data available for the specified month.',
        overall: { totalPresent: 0, totalAbsent: 0, totalLate: 0 },
        students: []
      };
    }

    // Transform the data for the overall report and by student
    const studentsMap = {};
    let totalPresent = 0, totalAbsent = 0, totalLate = 0;

    data.forEach((record) => {
      const student = studentsMap[record.student_id] || {
        name: record.students.name,
        present_days: 0,
        absent_days: 0,
        late_days: 0,
      };

      switch (record.status) {
        case 'Present':
          student.present_days += 1;
          totalPresent += 1;
          break;
        case 'Absent':
          student.absent_days += 1;
          totalAbsent += 1;
          break;
        case 'Late':
          student.late_days += 1;
          totalLate += 1;
          break;
        default:
          break;
      }

      studentsMap[record.student_id] = student;
    });

    const students = Object.values(studentsMap);

    return {
      message: 'Data retrieved successfully.',
      overall: { totalPresent, totalAbsent, totalLate },
      students,
    };
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return {
      message: 'Error fetching attendance data.',
      overall: { totalPresent: 0, totalAbsent: 0, totalLate: 0 },
      students: []
    };
  }
};
