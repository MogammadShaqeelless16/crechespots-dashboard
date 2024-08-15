import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Teachers.css';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/teachers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeachers(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Failed to fetch teachers');
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="teachers">
      <h1>Teachers</h1>
      {error && <p className="error">{error}</p>}
      <div className="teacher-list">
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <h2>{teacher.name}</h2>
              {/* Display more teacher details as needed */}
            </div>
          ))
        ) : (
          <p>No teachers available</p>
        )}
      </div>
    </div>
  );
};

export default Teachers;
