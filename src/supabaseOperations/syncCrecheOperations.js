import { supabase } from './supabaseClient'; // Adjust import according to your setup

// Fetch creches assigned to a specific user
export const fetchUserCreches = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    const { data, error } = await supabase
      .from('user_creche')
      .select(`
        creche_id,
        creches (
          id,
          name,
          header_image,
          price
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching creches:', error.message);
      return { success: false, error: error.message };
    }

    // Process data to ensure it's in the desired format
    const creches = data.map(item => item.creches).filter(creche => creche !== null);

    return { success: true, data: creches };
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
};
