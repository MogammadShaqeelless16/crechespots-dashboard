// crecheOperations.js
import { supabase } from './supabaseClient'; // Adjust import based on your file structure



export const fetchCrecheListUser = async (userId) => {
  try {
      // Fetch creche IDs linked to the user
      const { data: userCreches, error: userCrechesError } = await supabase
          .from('user_creche')
          .select('creche_id')
          .eq('user_id', userId);

      if (userCrechesError) throw userCrechesError;

      if (userCreches.length === 0) {
          return { success: true, data: [] };
      }

      // Extract creche IDs
      const crecheIds = userCreches.map(userCreche => userCreche.creche_id);

      // Fetch creche details
      const { data: creches, error: crechesError } = await supabase
          .from('creches')
          .select('*')
          .in('id', crecheIds);

      if (crechesError) throw crechesError;

      return { success: true, data: creches };
  } catch (error) {
      return { success: false, error: error.message };
  }
};




// Fetch the list of creches
export const fetchCrecheList = async () => {
  try {
    const { data, error } = await supabase
      .from('creches')
      .select('*');

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching creches:', error);
    return { success: false, error: error.message };
  }
};

// Add a new creche
export const addCreche = async (newCreche) => {
  try {
    const { data, error } = await supabase
      .from('creches')
      .insert([newCreche]);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error adding creche:', error);
    return { success: false, error: error.message };
  }
};

// Update an existing creche
export const updateCreche = async (crecheId, updatedCreche) => {
  try {
    const { data, error } = await supabase
      .from('creches')
      .update(updatedCreche)
      .match({ id: crecheId });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating creche:', error);
    return { success: false, error: error.message };
  }
};

// Delete a creche
export const deleteCreche = async (crecheId) => {
  try {
    const { data, error } = await supabase
      .from('creches')
      .delete()
      .match({ id: crecheId });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error deleting creche:', error);
    return { success: false, error: error.message };
  }
};
