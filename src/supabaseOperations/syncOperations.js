import { supabase } from './supabaseClient';
import { fetchRoles } from './roleOperations';

// Map WordPress roles to Supabase roles
const mapWordPressRoleToSupabaseRole = (wpRoles) => {
  // Example mapping logic - adjust according to your role setup
  if (wpRoles.includes('administrator')) return 1; // Example Supabase role ID
  if (wpRoles.includes('editor')) return 2;
  return 3; // Default role ID
};

// Sync users from WordPress to Supabase
export const syncUsers = async () => {
  try {
    // Fetch users from WordPress
    const response = await fetch('https://shaqeel.wordifysites.com/wp-json/wp/v2/users');
    const usersFromWordPress = await response.json();

    if (!Array.isArray(usersFromWordPress)) throw new Error('Invalid data from WordPress.');

    // Clear existing users or update as needed
    const { error: deleteError } = await supabase.from('users').delete().neq('id', ''); // Added condition to avoid deleting all
    if (deleteError) throw deleteError;

    // Prepare users for insertion with validation
    const userInsertions = usersFromWordPress.map(user => {
      const roleId = mapWordPressRoleToSupabaseRole(user.roles) || 3; // Default to role ID 3 if not found

      return {
        id: user.id || null, // Ensure ID is valid
        username: user.username || '',
        email: user.email || '',
        display_name: `${user.first_name || ''} ${user.last_name || ''}`,
        role_id: Number.isInteger(roleId) ? roleId : 3 // Ensure role_id is a valid integer
      };
    });

    // Insert or update users in Supabase
    const { error: insertError } = await supabase.from('users').upsert(userInsertions);
    if (insertError) throw insertError;

    return { success: true };
  } catch (error) {
    console.error('Error syncing users:', error.message || error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
};

// Fetch creches from Supabase
export const fetchCreches = async () => {
  try {
    const { data: creches, error } = await supabase.from('creches').select('*');
    if (error) throw error;
    return creches;
  } catch (error) {
    console.error('Error fetching creches:', error.message);
    throw error;
  }
};

// Add a new creche to Supabase
export const addCreche = async (newCrecheData) => {
  try {
    const { error } = await supabase.from('creches').insert([newCrecheData]);
    if (error) throw error;
  } catch (error) {
    console.error('Error adding creche:', error.message);
    throw error;
  }
};

// Update an existing creche in Supabase
export const updateCreche = async (crecheId, updatedData) => {
  try {
    const { error } = await supabase
      .from('creches')
      .update(updatedData)
      .eq('id', crecheId);
    if (error) throw error;
  } catch (error) {
    console.error('Error updating creche:', error.message);
    throw error;
  }
};

// Delete a creche from Supabase
export const deleteCreche = async (crecheId) => {
  try {
    const { error } = await supabase.from('creches').delete().eq('id', crecheId);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting creche:', error.message);
    throw error;
  }
};
