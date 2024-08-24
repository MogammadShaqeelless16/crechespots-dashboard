import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './Style/StudentDetails.css';

const StudentDetails = ({ student, onClose, onStudentUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [studentData, setStudentData] = useState(student);
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  useEffect(() => {
    // Fetch uploaded documents when the component is mounted
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(
          `https://shaqeel.wordifysites.com/wp-json/wp/v2/media?studentId=${student.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUploadedDocuments(response.data);
      } catch (err) {
        console.error('Fetch Documents Error:', err);
      }
    };

    fetchDocuments();
  }, [student.id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPortfolioFiles(e.target.files);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('jwtToken');

      // Upload each selected file
      for (const file of portfolioFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('studentId', student.id);

        await axios.post(
          'https://shaqeel.wordifysites.com/wp-json/wp/v2/media',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Disposition': `attachment; filename=${file.name}`,
            },
          }
        );
      }

      await axios.put(
        `https://shaqeel.wordifysites.com/wp-json/wp/v2/student/${student.id}`,
        studentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditing(false);
      onStudentUpdated();
    } catch (err) {
      console.error('Update Error:', err);
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text(`Full Name: ${studentData.title.rendered}`, 10, 10);
    doc.text(`Creche: ${studentData.related_creche}`, 10, 20);

    if (uploadedDocuments.length > 0) {
      doc.text('Portfolio Documents:', 10, 30);

      uploadedDocuments.forEach((docItem, index) => {
        const yPosition = 40 + index * 10;
        const linkText = `${index + 1}. ${docItem.title.rendered}`;
        
        // Add the document title as a clickable link
        doc.textWithLink(linkText, 10, yPosition, { url: docItem.source_url });
      });
    }

    const filename = `${studentData.title.rendered.replace(/\s+/g, '_').toLowerCase()}_portfolio.pdf`;
    doc.save(filename);
  };

  return (
    <div className="student-details-overlay">
      <div className="student-details-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Student Details</h2>
        {editing ? (
          <div>
            <label>
              Full Name:
              <input
                type="text"
                name="title"
                value={studentData.title.rendered}
                onChange={handleChange}
              />
            </label>
            <label>
              Creche:
              <input
                type="text"
                name="related_creche"
                value={studentData.related_creche}
                onChange={handleChange}
              />
            </label>
            <label>
              Upload Portfolio Documents (PDF):
              <input
                type="file"
                name="portfolioFiles"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
              />
            </label>
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <div>
            <p><strong>Full Name:</strong> {studentData.title.rendered}</p>
            <p><strong>Creche:</strong> {studentData.related_creche}</p>
            {uploadedDocuments.length > 0 && (
              <div>
                <h3>Uploaded Portfolio Documents:</h3>
                <ul>
                  {uploadedDocuments.map((docItem) => (
                    <li key={docItem.id}>
                      <a href={docItem.source_url} target="_blank" rel="noopener noreferrer">
                        {docItem.title.rendered}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleGeneratePDF}>Export Portfolio</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
