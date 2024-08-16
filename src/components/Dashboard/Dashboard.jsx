// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import DashboardCounters from './DashboardCounters';
import CrecheList from './CrecheList';
import UpcomingEvents from './UpcomingEvents';

const Dashboard = () => {
  const [creches, setCreches] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [profileName, setProfileName] = useState('');
  const [calendarIframe, setCalendarIframe] = useState('');

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

        // If there is at least one creche, use its calendar iframe
        if (filteredCreches.length > 0 && filteredCreches[0].calendar) {
          setCalendarIframe(filteredCreches[0].calendar);
        }

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

        setStudentsCount(filteredStudents.length);

        // Fetch staff data
        const staffResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/staff', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter staff based on the creches
        const filteredStaff = staffResponse.data.filter(staff =>
          filteredCreches.some(creche => creche.title.rendered === staff.creche_related)
        );

        setStaffCount(filteredStaff.length);

        // Fetch application counts
        const applicationResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const totalApplications = applicationResponse.headers['x-total-count'] || (Array.isArray(applicationResponse.data) ? applicationResponse.data.length : 0);
        setApplicationsCount(totalApplications);

      } catch (err) {
        console.error('Fetch Error:', err); 
        setError(err.response ? err.response.data.message : 'Failed to fetch data');
      }
    };

    fetchUserData();

    // Fetch events (optional, can be omitted if only using calendar iframe)
    const fetchEvents = async () => {
      try {
        const calendarId = 'your-google-calendar-id'; 
        const apiKey = 'your-google-api-key'; 
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
        console.error('Failed to fetch events:', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardCounters
        studentsCount={studentsCount}
        applicationsCount={applicationsCount}
        staffCount={staffCount}
      />
      <div className="dashboard-main">
        <CrecheList creches={creches} />
        <UpcomingEvents events={events} calendarIframe={calendarIframe} />
      </div>
    </div>
  );
};

export default Dashboard;
