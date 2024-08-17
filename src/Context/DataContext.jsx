import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [creches, setCreches] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [applications, setApplications] = useState([]);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState('');
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    const fetchAllData = async (endpoint, token, filterFunction) => {
      let allData = [];
      let page = 1;
      let totalPages = 1;

      do {
        try {
          const response = await axios.get(`https://shaqeel.wordifysites.com/wp-json/wp/v2/${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              per_page: 100,  // Fetch up to 100 posts per page
              page: page,     // Current page
            },
          });

          if (response.headers['x-wp-totalpages']) {
            totalPages = parseInt(response.headers['x-wp-totalpages'], 10);
          }

          allData = allData.concat(response.data);
          page += 1;
        } catch (err) {
          console.error(`Fetch Error for ${endpoint}:`, err);
          setError(err.response ? err.response.data.message : `Failed to fetch ${endpoint}`);
          break;
        }
      } while (page <= totalPages);

      return filterFunction ? filterFunction(allData) : allData;
    };

    const fetchData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      try {
        // Fetch user profile
        const profileResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const name = profileResponse.data.name;
        setProfileName(name);

        // Filter function to filter by creche assigned user
        const crecheFilter = (data) => data.filter(creche => creche.assigned_user && creche.assigned_user === name);

        // Fetch all creches
        const filteredCreches = await fetchAllData('creche', token, crecheFilter);
        setCreches(filteredCreches);

        // Filter function to filter by related creche
        const relatedCrecheFilter = (data) => data.filter(item =>
          filteredCreches.some(creche => creche.title.rendered === item.related_creche)
        );

        // Fetch students data
        const filteredStudents = await fetchAllData('student', token, relatedCrecheFilter);
        setStudentsCount(filteredStudents.length);

        // Fetch applications data
        const filteredApplications = await fetchAllData('application', token, relatedCrecheFilter);
        setApplications(filteredApplications);

        // Fetch staff data
        const relatedStaffFilter = (data) => data.filter(staff =>
          filteredCreches.some(creche => creche.title.rendered === staff.creche_related)
        );
        const filteredStaff = await fetchAllData('staff', token, relatedStaffFilter);
        setStaff(filteredStaff);

      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.response ? err.response.data.message : 'Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ creches, studentsCount, applications, staff, profileName, error }}>
      {children}
    </DataContext.Provider>
  );
};
