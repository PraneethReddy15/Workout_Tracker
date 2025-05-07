import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BodyPartSelector from '../components/BodyPartSelector';
import './AddWorkout.css';

const AddWorkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    workoutType: '',
    duration: '',
    intensity: 'medium',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBodyPartSelect = (partId) => {
    setSelectedBodyParts(prev => {
      if (prev.includes(partId)) {
        return prev.filter(id => id !== partId);
      } else {
        return [...prev, partId];
      }
    });
  };

  const handleNextStep = () => {
    if (!formData.workoutType || !formData.duration || !formData.date) {
      setError('Please fill out all required fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Combine form data with selected body parts
      const workoutData = {
        ...formData,
        bodyParts: selectedBodyParts
      };
  
      // Get token from local storage or other methods
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to add a workout');
        return;
      }
  
      // Make API request with correct backend URL
      const response = await axios.post('http://localhost:5000/api/workouts', workoutData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Added Bearer token in header
        },
        withCredentials: true
      });
      
      if (response.data) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="add-workout-container">
      <h2>Add New Workout</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {step === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
          <div className="form-group">
            <label htmlFor="workoutType">Workout Type</label>
            <input
              type="text"
              id="workoutType"
              name="workoutType"
              value={formData.workoutType}
              onChange={handleChange}
              required
              placeholder="e.g., Running, Weight Training, Yoga"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="intensity">Intensity</label>
            <select
              id="intensity"
              name="intensity"
              value={formData.intensity}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add any additional notes about your workout"
            />
          </div>
          
          <div className="button-group">
            <button type="submit" className="primary-button">
              Next: Select Body Parts
            </button>
            <button 
              type="button" 
              className="secondary-button" 
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="body-part-selection-step">
          <h3>Which body parts did you work on?</h3>
          <BodyPartSelector 
            selectedParts={selectedBodyParts}
            onSelectPart={handleBodyPartSelect}
          />
          
          <div className="button-group">
            <button 
              type="button" 
              className="primary-button" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Workout'}
            </button>
            <button 
              type="button" 
              className="secondary-button" 
              onClick={handlePrevStep}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWorkout;
