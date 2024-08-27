import supabase from '../supabaseOperations/supabaseClient'; // Ensure the path is correct

// Function to clear token from localStorage
export const clearToken = () => {
  localStorage.removeItem('jwtToken'); // Clear Supabase token if you are storing it manually
};


const fetchProfile = async () => {
  // Validate token and get user session
  const isValid = await validateToken();
  if (!isValid) {
    setError('User not logged in or token expired');
    return;
  }

  const { data: { session }, error: userError } = await supabase.auth.getSession();
  if (userError || !session) {
    setError('Error fetching user session');
    console.error('Session Error:', userError);
    return;
  }

  const userId = session.user.id;

  try {
    // Fetch user data from the 'users' table
    const { data, error: profileError } = await supabase
      .from('users') // Ensure this table name matches your Supabase schema
      .select('display_name, email, roles') // Fetch only the needed fields
      .eq('id', userId)
      .single();

    if (profileError) {
      setError('Error fetching profile data');
      console.error('Profile Fetch Error:', profileError);
      return;
    }

    // Set profile data
    setProfile(data);
  } catch (err) {
    setError('Failed to fetch profile');
    console.error('Fetch Error:', err);
  }
};

// Function to validate token
export const validateToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    return false;
  }
  return true;
};
