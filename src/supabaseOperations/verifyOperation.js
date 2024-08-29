// supabaseOperations/verifyOperation.js
import supabase from './supabaseClient'; // Adjust path as needed

export const VerifyOperation = async () => {
  try {
    // Fetch user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      throw new Error('Failed to retrieve user session.');
    }

    // Fetch user details
    const userId = sessionData.session.user.id;

    // Fetch user profile to get role and ID
    const { data: userProfile, error: userProfileError } = await supabase
      .from('users')
      .select('id, roles(role_name)')
      .eq('id', userId)
      .single();

    if (userProfileError || !userProfile) {
      throw new Error('Failed to retrieve user profile.');
    }

    return { userId: userProfile.id, role: userProfile.role_name };

  } catch (error) {
    console.error('VerifyOperation Error:', error);
    throw error;
  }
};
