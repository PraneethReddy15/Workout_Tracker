import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BodyPartSelector from './BodyPartSelector';
import './WorkoutPage.css';

const WorkoutPage = () => {
  const navigate = useNavigate();
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: '', reps: '', weight: '' }
  ]);
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle body part selection
  const handleBodyPartSelect = (bodyPart) => {
    if (selectedBodyParts.includes(bodyPart)) {
      setSelectedBodyParts(
        selectedBodyParts.filter((part) => part !== bodyPart)
      );
    } else {
      setSelectedBodyParts([...selectedBodyParts, bodyPart]);
    }
  };

  // Generate workout title based on selected body parts
  const generateWorkoutTitle = () => {
    if (selectedBodyParts.length === 0) return '';
    
    if (selectedBodyParts.length === 1) {
      return `${selectedBodyParts[0]} Workout`;
    }
    
    if (selectedBodyParts.length === 2) {
      return `${selectedBodyParts[0]} & ${selectedBodyParts[1]} Workout`;
    }
    
    return `${selectedBodyParts.join(', ')} Workout`;
  };

  // Update title when body parts change
  React.useEffect(() => {
    const title = generateWorkoutTitle();
    setWorkoutTitle(title);
  }, [selectedBodyParts]);

  // Handle exercise field changes
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  // Add a new exercise field
  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
  };

  // Remove an exercise field
  const handleRemoveExercise = (index) => {
    if (exercises.length === 1) return;
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  // Submit workout
  const handleSubmitWorkout = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!workoutTitle) {
      setError('Please select at least one body part');
      return;
    }
    
    if (!exercises[0].name) {
      setError('Please add at least one exercise');
      return;
    }
    
    const validExercises = exercises.filter(ex => 
      ex.name && ex.sets && ex.reps
    );
    
    if (validExercises.length === 0) {
      setError('Please complete at least one exercise (name, sets, and reps are required)');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const workoutData = {
        title: workoutTitle,
        exercises: validExercises,
        duration: parseInt(duration) || 0,
        bodyParts: selectedBodyParts,
        date: new Date()
      };
      
      await axios.post('http://localhost:5000/api/workouts', workoutData, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      setSuccess('Workout saved successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-page">
      <div className="workout-container">
        <h2>Create New Workout</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="body-part-section">
          <h3>Select Body Parts</h3>
          <BodyPartSelector 
            selectedParts={selectedBodyParts} 
            onSelectPart={handleBodyPartSelect} 
          />
        </div>
        
        <form onSubmit={handleSubmitWorkout} className="workout-form">
          <div className="form-group">
            <label htmlFor="workoutTitle">Workout Title</label>
            <input
              type="text"
              id="workoutTitle"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              placeholder="Workout Title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration in minutes"
              min="1"
            />
          </div>
          
          <div className="exercises-section">
            <h3>Exercises</h3>
            
            {exercises.map((exercise, index) => (
              <div key={index} className="exercise-item">
                <div className="exercise-header">
                  <h4>Exercise {index + 1}</h4>
                  {exercises.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-exercise-btn"
                      onClick={() => handleRemoveExercise(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="exercise-inputs">
                  <div className="form-group">
                    <label htmlFor={`exerciseName-${index}`}>Exercise Name</label>
                    <input
                      type="text"
                      id={`exerciseName-${index}`}
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                      placeholder="e.g. Bench Press"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`sets-${index}`}>Sets</label>
                      <input
                        type="number"
                        id={`sets-${index}`}
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                        placeholder="Sets"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`reps-${index}`}>Reps</label>
                      <input
                        type="number"
                        id={`reps-${index}`}
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        placeholder="Reps"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`weight-${index}`}>Weight (kg)</label>
                      <input
                        type="number"
                        id={`weight-${index}`}
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                        placeholder="Weight"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              type="button" 
              className="add-exercise-btn"
              onClick={handleAddExercise}
            >
              + Add Exercise
            </button>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutPage;