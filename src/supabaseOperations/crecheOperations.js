// crecheOperations.js
import { supabase } from './supabaseClient'; // Adjust import based on your file structure

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
