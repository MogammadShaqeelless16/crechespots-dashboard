import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient';
import './Style/AddStudent.css';

const AddStudent = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    studentNumber: '',
    parentName: '',
    parentWhatsappNumber: '',
    parentNumber: '',
    relatedCreche: ''
  });
  const [creches, setCreches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreches = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from('user_creche')
          .select('creche_ids')
          .eq('id', supabase.auth.user().id)
          .single();

        if (userError) throw new Error(userError.message);

        const { data: crecheData, error: crecheError } = await supabase
          .from('creches')
          .select('*')
          .in('id', userData.creche_ids);

        if (crecheError) throw new Error(crecheError.message);

        setCreches(crecheData);
      } catch (err) {
        setError('Failed to load creches.');
        console.error(err);
      }
    };

    fetchCreches();
  }, []);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('students')
        .insert([
          {
            name: formData.fullName,
            student_number: formData.studentNumber,
            parent_name: formData.parentName,
            parent_whatsapp: formData.parentWhatsappNumber,
            parent_phone_number: formData.parentNumber,
            creche_id: formData.relatedCreche,
            dob: new Date() // Set default DOB or add a DOB field to the form if needed
          }
        ]);

      if (error) throw new Error(error.message);

      onClose(); // Close the form on successful submission
    } catch (err) {
      setError(err.message || 'Failed to add student');
    }
  };

  return (
    <div className="overlay">
      <div className="form-container">
        <h2>Add Student</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Student Number:
            <input
              type="text"
              name="studentNumber"
              value={formData.studentNumber}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Parent Name:
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Parent Whatsapp Number:
            <input
              type="text"
              name="parentWhatsappNumber"
              value={formData.parentWhatsappNumber}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Parent Number:
            <input
              type="text"
              name="parentNumber"
              value={formData.parentNumber}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Related Creche:
            <select
              name="relatedCreche"
              value={formData.relatedCreche}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Creche</option>
              {creches.map(creche => (
                <option key={creche.id} value={creche.id}>
                  {creche.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
