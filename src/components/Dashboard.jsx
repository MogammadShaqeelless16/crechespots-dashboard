import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const [creches, setCreches] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      try {
        // Fetch the user profile to get the profile name
        const profileResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const name = profileResponse.data.name;
        setProfileName(name);
        console.log('Profile Name:', name);

        // Fetch creches and filter by the user's profile name
        const crecheResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/creche', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredCreches = crecheResponse.data.filter(
          (creche) => creche.assigned_user && creche.assigned_user === name
        );
        setCreches(filteredCreches);

        console.log('Filtered Creches:', filteredCreches); // Debugging line

        // Fetch student data
        const studentResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/student', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter students based on the creches
        const filteredStudents = studentResponse.data.filter(student =>
          filteredCreches.some(creche => creche.title.rendered === student.related_creche)
        );

        console.log('Filtered Students:', filteredStudents); // Debugging line

        setStudentsCount(filteredStudents.length);

        // Fetch application counts
        const applicationResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const totalApplications = applicationResponse.headers['x-total-count'] || (Array.isArray(applicationResponse.data) ? applicationResponse.data.length : 0);
        setApplicationsCount(totalApplications);

      } catch (err) {
        console.error('Fetch Error:', err); // More detailed error logging
        setError(err.response ? err.response.data.message : 'Failed to fetch data');
      }
    };

    fetchUserData();

    const fetchEvents = async () => {
      try {
        const calendarId = 'your-google-calendar-id'; // Replace with your Google Calendar ID
        const apiKey = 'your-google-api-key'; // Replace with your Google API key
        const calendarResponse = await axios.get(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
          {
            params: {
              key: apiKey,
              timeMin: new Date().toISOString(),
              orderBy: 'startTime',
              singleEvents: true,
            },
          }
        );
        setEvents(calendarResponse.data.items);
      } catch (err) {
        console.error('Failed to fetch events:', err); // More detailed error logging
      }
    };

    fetchEvents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      {/* Top counters */}
      <div className="dashboard-counters">
        <div className="counter-item">
          <h3>Students</h3>
          <p>{studentsCount}</p>
        </div>
        <div className="counter-item">
          <h3>Applications</h3>
          <p>{applicationsCount}</p>
        </div>
        <div className="counter-item">
          <h3>Teachers</h3>
          <p>Placeholder</p> {/* Replace this with the actual count if available */}
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-main">
        {/* Creches on the left */}
        <div className="creche-list">
          <h2>My Creche</h2>
          {creches.length > 0 ? (
            creches.map((creche) => (
              <div key={creche.id} className="creche-box">
                <Link to={`/creche/${creche.id}`} className="creche-card">
                  {creche.header_image && (
                    <img src={creche.header_image} alt={creche.title.rendered} className="creche-card-image" />
                  )}
                  <div className="creche-card-content">
                    <h3 className="creche-card-title">{creche.title.rendered}</h3>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No creches available</p>
          )}
        </div>

        {/* Upcoming events on the right */}
        <div className="upcoming-events">
          <h2>Upcoming Events</h2>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="event-item">
                <h3>{event.summary}</h3>
                <p>{new Date(event.start.dateTime || event.start.date).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
