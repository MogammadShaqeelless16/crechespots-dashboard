// src/utils/auth.js
import axios from 'axios';

// Function to clear token from localStorage
export const clearToken = () => {
  localStorage.removeItem('jwtToken');
};

// Function to validate token
export const validateToken = async () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    return false;
  }

  try {
    await axios.post(
      'https://shaqeel.wordifysites.com/wp-json/api/v1/token-validate',
      {}, // Assuming no body content is needed for validation
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return true; // Token is valid
  } catch (error) {
    console.error('Token validation failed:', error.response ? error.response.data : error.message);

    // Clear invalid or expired token
    clearToken();
    
    return false; // Token is invalid or expired
  }
};
