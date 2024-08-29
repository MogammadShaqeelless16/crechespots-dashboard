// src/supabaseOperations/counterOperations.js
import { supabase } from './supabaseClient';

// Fetch creche counters for a list of creche IDs
export const fetchCrecheCounters = async (crecheIds) => {
  try {
    // Initialize counters
    let totalCounters = {
      studentsCount: 0,
      staffCount: 0,
      applicationsCount: 0,
      pendingApplicationsCount: 0
    };

    // Iterate over each creche ID and fetch the counters
    for (const crecheId of crecheIds) {
      // Fetch number of students
      const { count: studentsCount, error: studentsError } = await supabase
        .from('students')
        .select('*', { count: 'exact' })
        .eq('creche_id', crecheId);

      if (studentsError) throw new Error(studentsError.message);
      totalCounters.studentsCount += studentsCount;

      // Fetch number of staff
      const { count: staffCount, error: staffError } = await supabase
        .from('staff')
        .select('*', { count: 'exact' })
        .eq('creche_id', crecheId);

      if (staffError) throw new Error(staffError.message);
      totalCounters.staffCount += staffCount;

      // Fetch number of new applications
      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('creche_id', crecheId)
        .eq('application_status', 'New');

      if (applicationsError) throw new Error(applicationsError.message);
      totalCounters.applicationsCount += applicationsCount;

      // Fetch number of pending applications
      const { count: pendingApplicationsCount, error: pendingApplicationsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('creche_id', crecheId)
        .eq('application_status', 'pending');

      if (pendingApplicationsError) throw new Error(pendingApplicationsError.message);
      totalCounters.pendingApplicationsCount += pendingApplicationsCount;
    }

    return totalCounters;
  } catch (error) {
    console.error('Error fetching creche counters:', error);
    return {
      studentsCount: 0,
      staffCount: 0,
      applicationsCount: 0,
      pendingApplicationsCount: 0
    };
  }
};
