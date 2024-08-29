import { supabase } from './supabaseClient';



// Fetch users with their roles and optional creches
export const fetchUsersFromSupabase = async () => {
  try {
    // Fetch users with their roles and optionally their creches
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        display_name,
        role_id,
        roles (role_name),
        user_creche (
          creche_id,
          creches (name)
        )
      `)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // Transform data to include creches details even if none are assigned
    const transformedData = data.map(user => ({
      ...user,
      creches: user.user_creche
        ? user.user_creche.map(uc => uc.creches) // Extract creche details if available
        : [] // Default to empty array if no creches assigned
    }));

    return { success: true, data: { users: transformedData } };
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return { success: false, error: error.message };
  }
};

// Add a new user
export const addUser = async (newUser, roleId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ ...newUser, role_id: roleId }]);

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error adding user:', error.message);
    return { success: false, error: error.message };
  }
};

// Update an existing user
export const updateUser = async (userId, updateFields, roleId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updateFields, role_id: roleId })
      .match({ id: userId });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating user:', error.message);
    return { success: false, error: error.message };
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .match({ id: userId });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error deleting user:', error.message);
    return { success: false, error: error.message };
  }
};


export const fetchCurrentUserData = async () => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error('No user is currently logged in.');
    }

    // Fetch creche IDs associated with the current user
    const { data, error } = await supabase
      .from('user_creche')
      .select('creche_id')
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Extract creche IDs
    const crecheIds = data.map(uc => uc.creche_id);

    return {
      success: true,
      data: {
        userId: user.id,
        crecheIds
      }
    };
  } catch (error) {
    console.error('Error fetching user creche IDs:', error.message);
    return { success: false, error: error.message };
  }
};