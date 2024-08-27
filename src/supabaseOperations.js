import { supabase } from './supabaseOperations/supabaseClient';

// Fetch users from Supabase
export const fetchUsersFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching users:', error.message || error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
};

// Generate a unique ID for new users
const generateUniqueId = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id');

    if (error) throw error;

    const existingIds = data.map(user => user.id);
    let newId;

    do {
      newId = Math.floor(Math.random() * 1000000); // Adjust range if needed
    } while (existingIds.includes(newId));

    return newId;
  } catch (error) {
    console.error('Error generating unique ID:', error.message || error);
    return null;
  }
};

// Add a new user
export const addUser = async (user, roleId) => {
  try {
    const uniqueId = await generateUniqueId();
    if (!uniqueId) throw new Error('Failed to generate unique ID.');

    const formattedRoleId = parseInt(roleId, 10); // Ensure roleId is an integer

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{ ...user, id: uniqueId, role_id: formattedRoleId }])
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('User insertion returned no data.');

    return { success: true, data: userData };
  } catch (error) {
    console.error('Error adding user:', error.message || error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
};

// Update an existing user
export const updateUser = async (userId, updateFields, roleId, crecheIds) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updateFields)
      .eq('id', userId);

    if (error) throw error;

    // Update the user's roles
    await supabase.from('user_roles').delete().eq('user_id', userId);
    await supabase.from('user_roles').insert({ user_id: userId, role_id: roleId });

    // Update the user's creches
    await supabase.from('user_creche').delete().eq('user_id', userId);
    await supabase.from('user_creche').insert(crecheIds.map(crecheId => ({
      user_id: userId,
      creche_id: crecheId
    })));

    return { success: true, data };
  } catch (error) {
    console.error('Error updating user:', error.message);
    return { success: false, error: error.message };
  }
};

// Fetch roles from Supabase
export const fetchRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*');

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching roles:', error.message || error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
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

// Map WordPress roles to Supabase roles (implement this function as needed)
const mapWordPressRoleToSupabaseRole = (wpRoles) => {
  // Example mapping logic - adjust according to your role setup
  if (wpRoles.includes('administrator')) return 1; // Example Supabase role ID
  if (wpRoles.includes('editor')) return 2;
  return 3; // Default role ID
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    if (!data) throw new Error('User deletion returned no data.');

    return { success: true, data };
  } catch (error) {
    console.error('Error deleting user:', error.message || error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
};
