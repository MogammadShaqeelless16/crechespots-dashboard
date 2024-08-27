import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabaseOperations/supabaseClient'; // Ensure the path is correct
import { clearToken } from '../utils/auth'; // Adjust the path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faSignOutAlt, faHome, faChalkboardTeacher, faFileAlt, faUsers, faCalendar, faQuestionCircle, faReceipt, faLock, faCogs, faDatabase, faTicketAlt, faBook, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import './Layout.css';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error fetching user:', error.message);
        clearToken();
        setIsLoggedIn(false);
        return;
      }

      if (user) {
        setUserProfile(user);
        setIsLoggedIn(true);

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('roles(role_name), profile_picture_url')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile data:', profileError.message);
        } else {
          setUserRole(profileData?.roles?.role_name || '');
          setUserProfile(prevProfile => ({
            ...prevProfile,
            profile_picture_url: profileData?.profile_picture_url || prevProfile.profile_picture_url
          }));
        }
      } else {
        setUserProfile(null);
        setIsLoggedIn(false);
      }
    };

    checkUserAuth();
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
      return;
    }

    clearToken();
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleMouseEnter = () => setIsAdminMenuOpen(true);
  const handleMouseLeave = () => setIsAdminMenuOpen(false);

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
            {(userRole === 'Administrator' || userRole === 'Developer') && (
              <div 
                className="admin-menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="#" className="menu-item">
                  <FontAwesomeIcon icon={faLock} />
                  Admin
                </Link>
                {isAdminMenuOpen && (
                  <div className="admin-menu-dropdown">
                    <Link to="/usermanagement" className="dropdown-item">
                      <FontAwesomeIcon icon={faUsers} />
                      User Management
                    </Link>
                    <Link to="/crechemanagement" className="dropdown-item">
                      <FontAwesomeIcon icon={faCogs} />
                      Creche Management
                    </Link>
                    <Link to="/reports" className="dropdown-item">
                      <FontAwesomeIcon icon={faReceipt} />
                      Reports and Analytics
                    </Link>
                    <Link to="/contentmanagement" className="dropdown-item">
                      <FontAwesomeIcon icon={faBook} />
                      Content Management
                    </Link>
                    <Link to="/systemsettings" className="dropdown-item">
                      <FontAwesomeIcon icon={faCogs} />
                      System Settings
                    </Link>
                    <Link to="/integrations" className="dropdown-item">
                      <FontAwesomeIcon icon={faDatabase} />
                      Integrations
                    </Link>
                    <Link to="/supporttickets" className="dropdown-item">
                      <FontAwesomeIcon icon={faTicketAlt} />
                      Support Tickets
                    </Link>
                    <Link to="/auditlogs" className="dropdown-item">
                      <FontAwesomeIcon icon={faShieldAlt} />
                      Audit Logs
                    </Link>
                  </div>
                )}
              </div>
            )}
            <div className="icon-buttons">
              <button onClick={toggleDarkMode} className="icon-button">
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              </button>
              <button onClick={handleLogout} className="icon-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
            {userProfile && (
              <Link to="/profile" className="user-profile">
                <img
                  src={userProfile.profile_picture_url || '/default-avatar.png'}
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
