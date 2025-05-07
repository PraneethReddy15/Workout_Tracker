import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WorkoutHistory.css';

const WorkoutHistory = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    workoutType: '',
    startDate: '',
    endDate: '',
    intensity: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const workoutsPerPage = 9;

  // Fixed useEffect to depend on both currentPage and filters
  useEffect(() => {
    // On initial load, fetch without filters
    if (loading) {
      console.log('Initial data load');
      fetchWorkouts({});
    } else {
      // When changing pages, use current active filters
      const activeFilters = {};
      
      if (filters.workoutType) {
        activeFilters.workoutType = filters.workoutType;
      }
      
      if (filters.startDate) {
        activeFilters.startDate = new Date(filters.startDate).toISOString();
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        activeFilters.endDate = endDate.toISOString();
      }
      
      if (filters.intensity) {
        activeFilters.intensity = filters.intensity;
      }
      
      console.log('Page change with filters:', activeFilters);
      fetchWorkouts(activeFilters);
    }
    // eslint-disable-next-line
  }, [currentPage]); // We'll handle filter changes separately with applyFilters

  const fetchWorkouts = async (filterParams = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Create a clean object with only the filters that have values
      const cleanParams = {
        page: currentPage,
        limit: workoutsPerPage
      };
      
      // Process date filters explicitly
      if (filterParams.startDate) {
        const startDate = new Date(filterParams.startDate);
        cleanParams.startDate = startDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
      
      if (filterParams.endDate) {
        const endDate = new Date(filterParams.endDate);
        cleanParams.endDate = endDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
      
      // Add other filters
      if (filterParams.workoutType) {
        cleanParams.workoutType = filterParams.workoutType;
      }
      
      if (filterParams.intensity) {
        cleanParams.intensity = filterParams.intensity;
      }

      // Log the final request parameters
      console.log('Fetching workouts with params:', cleanParams);
      
      // Make the API request with clean parameters
      const response = await axios.get('http://localhost:5000/api/workouts', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: cleanParams
      });

      console.log('API response:', response.data);

      // Handle both response formats: 
      // 1. Direct array of workouts: [workout1, workout2, ...]
      // 2. Object with workouts and total: {workouts: [...], total: 10}
      if (response.data) {
        if (Array.isArray(response.data)) {
          // Direct array response
          setWorkouts(response.data);
          setTotalPages(Math.ceil(response.data.length / workoutsPerPage) || 1);
        } else if (response.data.workouts && Array.isArray(response.data.workouts)) {
          // Object with workouts array and total
          setWorkouts(response.data.workouts);
          setTotalPages(Math.ceil(response.data.total / workoutsPerPage) || 1);
        } else {
          // Handle unexpected response format
          console.error('Unexpected API response format:', response.data);
          setWorkouts([]);
          setTotalPages(1);
          setError('Received invalid data format from server');
        }
      } else {
        setWorkouts([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        
        if (err.response.status === 401) {
          localStorage.removeItem('token'); // Clear invalid token
          navigate('/login');
          return;
        }
        
        setError(`Failed to load workout history: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('Server not responding. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Failed to send request: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    const activeFilters = {};
    
    // Process each filter properly, especially dates
    if (filters.workoutType) {
      activeFilters.workoutType = filters.workoutType;
    }
    
    // Format dates for API consumption (ISO format)
    if (filters.startDate) {
      activeFilters.startDate = new Date(filters.startDate).toISOString();
    }
    
    if (filters.endDate) {
      // Set the end date to the end of the selected day (23:59:59)
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      activeFilters.endDate = endDate.toISOString();
    }
    
    if (filters.intensity) {
      activeFilters.intensity = filters.intensity;
    }
    
    console.log('Applying filters:', activeFilters);
    fetchWorkouts(activeFilters);
  };

  const resetFilters = () => {
    // Clear all filter values
    setFilters({
      workoutType: '',
      startDate: '',
      endDate: '',
      intensity: ''
    });
    setCurrentPage(1);
    // Ensure we're clearing all filters in the API call
    console.log('Resetting all filters');
    fetchWorkouts({});
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:5000/api/workouts/${workoutId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh the current page after successful deletion
      const activeFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          activeFilters[key] = filters[key];
        }
      });
      fetchWorkouts(activeFilters);
      
    } catch (err) {
      console.error('Error deleting workout:', err);
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError(`Failed to delete workout: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderPagination = () => {
    const pages = [];

    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        &laquo;
      </button>
    );

    // Only show a reasonable number of page buttons
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={currentPage === i ? 'active' : ''}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        &raquo;
      </button>
    );

    return pages;
  };

  return (
    <div className="workout-history-container">
      <header className="workout-history-header">
        <h1>Workout History</h1>
        <div className="header-actions">
          <Link to="/add-workout" className="add-workout-button">Add New Workout</Link>
          <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>Dismiss</button>
        </div>
      )}

      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="workoutType">Workout Type</label>
          <input
            type="text"
            id="workoutType"
            name="workoutType"
            value={filters.workoutType}
            onChange={handleFilterChange}
            placeholder="e.g., Running, Yoga"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="intensity">Intensity</label>
          <select
            id="intensity"
            name="intensity"
            value={filters.intensity}
            onChange={handleFilterChange}
          >
            <option value="">All Intensities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-buttons">
          <button className="filter-apply" onClick={applyFilters}>Apply Filters</button>
          <button className="filter-reset" onClick={resetFilters}>Reset</button>
        </div>
      </div>

      {loading && workouts.length === 0 ? (
        <div className="loading">Loading workout history...</div>
      ) : workouts.length > 0 ? (
        <>
          <div className="workouts-grid">
            {workouts.map(workout => (
              <div key={workout._id} className="workout-card">
                <div className="workout-card-header">
                  <h3>{workout.workoutType}</h3>
                  <span className="workout-date">{formatDate(workout.date)}</span>
                </div>

                <div className="workout-details">
                  <p><span>Duration:</span> <span>{workout.duration} minutes</span></p>
                  <p>
                    <span>Intensity:</span> 
                    <span className={`workout-intensity intensity-${workout.intensity.toLowerCase()}`}>
                      {workout.intensity}
                    </span>
                  </p>
                </div>

                {workout.notes && (
                  <div className="workout-notes">
                    <p><strong>Notes:</strong></p>
                    <p>{workout.notes}</p>
                  </div>
                )}

                {workout.bodyParts && workout.bodyParts.length > 0 && (
                  <div className="workout-body-parts">
                    {workout.bodyParts.map(part => (
                      <span key={part} className="body-part-tag">{part}</span>
                    ))}
                  </div>
                )}

                <div className="workout-actions">
                  <button 
                    className="edit-button"
                    onClick={() => navigate(`/edit-workout/${workout._id}`)}>
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteWorkout(workout._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">{renderPagination()}</div>
        </>
      ) : (
        <div className="no-workouts">
          <p>No workouts found matching your criteria.</p>
          <Link to="/add-workout" className="add-workout-button">Add Your First Workout</Link>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;