import { supabase } from './supabaseClient'; // Adjust import path as needed

export const fetchRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*');
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
