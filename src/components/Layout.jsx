import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearToken } from '../utils/auth'; // Adjust the path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faSignOutAlt, faHome, faChalkboardTeacher, faFileAlt, faUsers, faCalendar, faQuestionCircle , faReceipt } from '@fortawesome/free-solid-svg-icons';
import './Layout.css';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure the response contains the expected data
        if (response.data && response.data.avatar_urls) {
          setUserProfile(response.data);
          setIsLoggedIn(true);
        } else {
          setUserProfile(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        clearToken();
        setIsLoggedIn(false);
        navigate('/login'); // Use navigate instead of history.push
      }
    };

    fetchUserProfile();
    const storedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedMode);
    document.body.classList.toggle('dark-mode', storedMode);
  }, [navigate]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    navigate('/'); // Use navigate instead of history.push
  };

  return (
    <div className={`layout ${darkMode ? 'dark' : 'light'}`}>
      <header className="top-menu">
        {!isLoggedIn ? (
          <>
            <Link to="/" className="menu-item">
              <FontAwesomeIcon icon={faHome} />
              Login
            </Link>
            <Link to="/about" className="menu-item">
              <FontAwesomeIcon icon={faFileAlt} />
              About Us
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="menu-item">
              <FontAwesomeIcon icon={faHome} />
              Dashboard
            </Link>
            <Link to="/Staff" className="menu-item">
              <FontAwesomeIcon icon={faChalkboardTeacher} />
              Staff
            </Link>
            <Link to="/applications" className="menu-item">
              <FontAwesomeIcon icon={faFileAlt} />
              Applications
            </Link>
            <Link to="/students" className="menu-item">
              <FontAwesomeIcon icon={faUsers} />
              Students
            </Link>
            <Link to="/crecheWishlist" className="menu-item">
              <FontAwesomeIcon icon={faCalendar} />
              Wish List
            </Link>
            <Link to="/reports" className="menu-item">
              <FontAwesomeIcon icon={faReceipt} />
              Reports
            </Link>
            <Link to="/help" className="menu-item">
              <FontAwesomeIcon icon={faQuestionCircle} />
              Help
            </Link>
            <div className="icon-buttons">
              <button onClick={toggleDarkMode} className="icon-button">
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              </button>
              <button onClick={handleLogout} className="icon-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
            {userProfile && userProfile.avatar_urls && (
              <Link to="/profile" className="user-profile">
                <img
                  src={userProfile.avatar_urls[96] || '/default-avatar.png'} // Default image if not available
                  alt="User Profile"
                  className="user-avatar"
                />
              </Link>
            )}
          </>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
