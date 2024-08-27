import React, { useEffect, useState } from 'react';
import supabase from '../supabaseOperations/supabaseClient'; // Ensure this is correctly set up
import { validateToken } from '../utils/auth'; // Adjust path as necessary
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({
        display_name: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        id_number: '',
        bio: '',
        profile_picture_url: '',
        roles: { role_name: '' } // Initialize roles as an object
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
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
                // Fetch user profile with role information
                const { data, error: profileError } = await supabase
                    .from('users')
                    .select(`
                        display_name,
                        email,
                        profile_picture_url,
                        bio,
                        first_name,
                        last_name,
                        phone_number,
                        id_number,
                        roles(role_name)
                    `)
                    .eq('id', userId)
                    .single();

                if (profileError) {
                    setError('Error fetching profile data');
                    console.error('Profile Fetch Error:', profileError);
                    return;
                }

                console.log(data); // Debug: Check fetched data
                setProfile(data);
            } catch (err) {
                setError('Failed to fetch profile');
                console.error('Fetch Error:', err);
            }
        };

        fetchProfile();
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            // Generate a unique file name
            const fileName = `${Date.now()}_${file.name}`;

            // Upload the file
            const { error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get the public URL of the uploaded file
            const { publicURL, error: urlError } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(fileName);

            if (urlError) throw urlError;

            // Get the user session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) throw sessionError;

            const userId = session.user.id;

            // Update the user's profile with the new profile picture URL
            const { error: updateError } = await supabase
                .from('users')
                .update({ profile_picture_url: publicURL })
                .eq('id', userId);

            if (updateError) throw updateError;

            // Update the local state with the new URL
            setProfile((prevProfile) => ({
                ...prevProfile,
                profile_picture_url: publicURL
            }));

            setSuccess('Profile picture updated successfully!');
        } catch (err) {
            setError(`Upload Error: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) throw sessionError;

            const userId = session.user.id;

            const { error: updateError } = await supabase
                .from('users')
                .update({
                    display_name: profile.display_name,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    phone_number: profile.phone_number,
                    id_number: profile.id_number,
                    bio: profile.bio
                })
                .eq('id', userId);

            if (updateError) throw updateError;

            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(`Update Error: ${err.message}`);
        }
    };

    return (
        <div className="profile">
            <h1>Profile</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="profile-picture">
                        <img
                            src={profile.profile_picture_url || '/default-profile.png'}
                            alt="Profile"
                            className="profile-picture-img"
                        />
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleImageUpload}
                        />
                        {uploading && <p>Uploading...</p>}
                    </div>
                    <input
                        type="text"
                        name="display_name"
                        value={profile.display_name}
                        onChange={handleChange}
                        placeholder="Display Name"
                    />
                    <input
                        type="text"
                        name="first_name"
                        value={profile.first_name}
                        onChange={handleChange}
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        name="last_name"
                        value={profile.last_name}
                        onChange={handleChange}
                        placeholder="Last Name"
                    />
                    <input
                        type="text"
                        name="phone_number"
                        value={profile.phone_number}
                        onChange={handleChange}
                        placeholder="Phone Number"
                    />
                    <input
                        type="text"
                        name="id_number"
                        value={profile.id_number}
                        onChange={handleChange}
                        placeholder="ID Number"
                    />
                    <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                    />
                    <button type="submit">Update Profile</button>
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Cancel
                    </button>
                </form>
            ) : (
                <div className="profile-details">
                    <div className="profile-picture">
                        <img
                            src={profile.profile_picture_url || '/default-profile.png'}
                            alt="Profile"
                            className="profile-picture-img"
                        />
                    </div>
                    <p><strong>Display Name:</strong> {profile.display_name || 'Not available'}</p>
                    <p><strong>First Name:</strong> {profile.first_name || 'Not available'}</p>
                    <p><strong>Last Name:</strong> {profile.last_name || 'Not available'}</p>
                    <p><strong>Phone Number:</strong> {profile.phone_number || 'Not available'}</p>
                    <p><strong>ID Number:</strong> {profile.id_number || 'Not available'}</p>
                    <p><strong>Bio:</strong> {profile.bio || 'Not available'}</p>
                    <p><strong>Role:</strong> {profile.roles.role_name || 'Not available'}</p> {/* Updated role display */}
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
