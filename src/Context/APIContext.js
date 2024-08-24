// APIContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const APIContext = createContext();

const APIProvider = ({ children }) => {
  const [creches, setCreches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [students, setStudents] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      try {
        // Fetch creches
        const crecheResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/creche', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCreches(crecheResponse.data);

        // Fetch staff
        const staffResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/staff', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff(staffResponse.data);

        // Fetch students
        const studentResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/student', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(studentResponse.data);

        // Fetch application counts
        const applicationResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/application', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicationsCount(applicationResponse.headers['x-total-count'] || 0);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  return (
    <APIContext.Provider value={{ creches, staff, students, applicationsCount, error }}>
      {children}
    </APIContext.Provider>
  );
};

export { APIContext, APIProvider };
