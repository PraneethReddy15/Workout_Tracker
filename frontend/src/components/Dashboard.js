// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Dashboard.css';

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [workouts, setWorkouts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         const config = {
//           headers: {
//             'x-auth-token': token
//           }
//         };

//         // Fetch user profile
//         const userRes = await axios.get('http://localhost:5000/api/users/profile', config);

//         // Fetch user's workouts
//         const workoutsRes = await axios.get('http://localhost:5000/api/workouts', config);

//         setUser(userRes.data);
//         setWorkouts(workoutsRes.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching data', err);
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     };

//     fetchUserData();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loader"></div>
//         <p>Loading your workout data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard">
//       <header className="dashboard-header">
//         <h1>Workout Tracker</h1>
//         <div className="user-info">
//           <span>Welcome, {user.username}!</span>
//           <button className="logout-button" onClick={handleLogout}>Logout</button>
//         </div>
//       </header>

//       <main className="dashboard-content">
//         <section className="dashboard-summary">
//           <div className="summary-card">
//             <h3>Total Workouts</h3>
//             <p className="summary-value">{workouts.length}</p>
//           </div>
//           {/* More summary cards can be added here */}
//         </section>

//         <section className="workouts-section">
//           <div className="section-header">
//             <h2>Your Workouts</h2>
//             <button className="add-workout-button">+ Add Workout</button>
//           </div>

//           {workouts.length === 0 ? (
//             <div className="empty-state">
//               <p>You haven't added any workouts yet.</p>
//               <button className="add-workout-button">Add Your First Workout</button>
//             </div>
//           ) : (
//             <div className="workouts-list">
//               {workouts.map((workout) => (
//                 <div className="workout-card" key={workout._id}>
//                   <div className="workout-header">
//                     <h3>{workout.title}</h3>
//                     <span className="workout-date">
//                       {new Date(workout.date).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="workout-details">
//                     <p>
//                       <strong>Duration:</strong> {workout.duration} minutes
//                     </p>
//                     <p>
//                       <strong>Exercises:</strong> {workout.exercises.length}
//                     </p>
//                   </div>
//                   <div className="workout-actions">
//                     <button className="view-button">View Details</button>
//                     <button className="edit-button">Edit</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import './Dashboard.css';

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [workouts, setWorkouts] = useState([]);
//   const [latestWorkout, setLatestWorkout] = useState(null);
//   const [stats, setStats] = useState({
//     totalWorkouts: 0,
//     thisWeekWorkouts: 0,
//     mostFrequentBodyPart: '-'
//   });
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         const config = {
//           headers: {
//             'x-auth-token': token
//           }
//         };

//         // Fetch user profile
//         const userRes = await axios.get('http://localhost:5000/api/users/profile', config);

//         // Fetch user's workouts
//         const workoutsRes = await axios.get('http://localhost:5000/api/workouts', config);

//         const allWorkouts = workoutsRes.data;
//         setUser(userRes.data);
//         setWorkouts(allWorkouts);

//         // Calculate statistics
//         calculateStats(allWorkouts);

//         // Get latest workout
//         if (allWorkouts.length > 0) {
//           // Sort by date descending
//           const sortedWorkouts = [...allWorkouts].sort((a, b) =>
//             new Date(b.date) - new Date(a.date)
//           );
//           setLatestWorkout(sortedWorkouts[0]);
//         }

//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching data', err);
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     };

//     fetchUserData();
//   }, [navigate]);

//   // Calculate workout statistics
//   const calculateStats = (workouts) => {
//     // Total workouts
//     const totalWorkouts = workouts.length;

//     // This week's workouts
//     const today = new Date();
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
//     startOfWeek.setHours(0, 0, 0, 0);

//     const thisWeekWorkouts = workouts.filter(workout =>
//       new Date(workout.date) >= startOfWeek
//     ).length;

//     // Most frequent body part
//     const bodyPartCounts = {};
//     workouts.forEach(workout => {
//       if (workout.bodyParts && workout.bodyParts.length > 0) {
//         workout.bodyParts.forEach(part => {
//           bodyPartCounts[part] = (bodyPartCounts[part] || 0) + 1;
//         });
//       }
//     });

//     let mostFrequentBodyPart = '-';
//     let maxCount = 0;

//     for (const [part, count] of Object.entries(bodyPartCounts)) {
//       if (count > maxCount) {
//         mostFrequentBodyPart = part.charAt(0).toUpperCase() + part.slice(1);
//         maxCount = count;
//       }
//     }

//     setStats({
//       totalWorkouts,
//       thisWeekWorkouts,
//       mostFrequentBodyPart
//     });
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       weekday: 'long',
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loader"></div>
//         <p>Loading your workout data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard">
//       <header className="dashboard-header">
//         <h1>Workout Tracker</h1>
//         <div className="user-info">
//           <span>Welcome, {user.username}!</span>
//           <button className="logout-button" onClick={handleLogout}>Logout</button>
//         </div>
//       </header>

//       <main className="dashboard-content">
//         <nav className="dashboard-nav">
//           <ul>
//             <li className="active">
//               <Link to="/dashboard">Dashboard</Link>
//             </li>
//             <li>
//               <Link to="/add-workout">Add Workout</Link>
//             </li>
//             <li>
//               <Link to="/workout-history">Workout History</Link>
//             </li>
//           </ul>
//         </nav>

//         <section className="dashboard-summary">
//           <div className="summary-card">
//             <h3>Total Workouts</h3>
//             <p className="summary-value">{stats.totalWorkouts}</p>
//           </div>

//           <div className="summary-card">
//             <h3>This Week</h3>
//             <p className="summary-value">{stats.thisWeekWorkouts}</p>
//           </div>

//           <div className="summary-card">
//             <h3>Most Trained</h3>
//             <p className="summary-value">{stats.mostFrequentBodyPart}</p>
//           </div>
//         </section>

//         <section className="dashboard-latest">
//           <div className="section-header">
//             <h2>Latest Workout</h2>
//             <Link to="/add-workout" className="add-workout-button">+ Add Workout</Link>
//           </div>

//           {!latestWorkout ? (
//             <div className="empty-state">
//               <p>You haven't recorded any workouts yet.</p>
//               <Link to="/add-workout" className="add-workout-button">Add Your First Workout</Link>
//             </div>
//           ) : (
//             <div className="latest-workout">
//               <div className="workout-card large">
//                 <div className="workout-header">
//                   <h3>{latestWorkout.title}</h3>
//                   <span className="workout-date">{formatDate(latestWorkout.date)}</span>
//                 </div>

//                 <div className="workout-details">
//                   <div className="workout-stats">
//                     <div className="stat-item">
//                       <span className="stat-label">Duration</span>
//                       <span className="stat-value">{latestWorkout.duration} min</span>
//                     </div>

//                     <div className="stat-item">
//                       <span className="stat-label">Exercises</span>
//                       <span className="stat-value">{latestWorkout.exercises.length}</span>
//                     </div>

//                     {latestWorkout.bodyParts && latestWorkout.bodyParts.length > 0 && (
//                       <div className="body-parts">
//                         {latestWorkout.bodyParts.map(part => (
//                           <span key={part} className="body-part-tag">
//                             {part.charAt(0).toUpperCase() + part.slice(1)}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="workout-exercises">
//                     <h4>Exercises</h4>
//                     <ul className="exercise-list">
//                       {latestWorkout.exercises.map((exercise, index) => (
//                         <li key={index} className="exercise-item">
//                           <div className="exercise-name">{exercise.name}</div>
//                           <div className="exercise-details">
//                             {exercise.sets} sets × {exercise.reps} reps
//                             {exercise.weight && <span className="exercise-weight"> · {exercise.weight} {exercise.unit || 'kg'}</span>}
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   {latestWorkout.notes && (
//                     <div className="workout-notes">
//                       <h4>Notes</h4>
//                       <p>{latestWorkout.notes}</p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="workout-actions">
//                   <Link
//                     to={`/workout/${latestWorkout._id}`}
//                     className="view-details-button"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         <section className="dashboard-recent">
//           <div className="section-header">
//             <h2>Recent Workouts</h2>
//             <Link to="/workout-history" className="view-all-link">View All</Link>
//           </div>

//           {workouts.length <= 1 ? (
//             <p className="no-workouts-message">No previous workouts to display.</p>
//           ) : (
//             <div className="recent-workouts">
//               {workouts
//                 .slice(0, Math.min(4, workouts.length))
//                 .sort((a, b) => new Date(b.date) - new Date(a.date))
//                 .slice(1) // Skip latest (already shown above)
//                 .map(workout => (
//                   <div key={workout._id} className="workout-card small">
//                     <div className="workout-header">
//                       <h3>{workout.title}</h3>
//                       <span className="workout-date">{formatDate(workout.date)}</span>
//                     </div>

//                     <div className="workout-summary">
//                       <div className="stat-pills">
//                         <span className="stat-pill">{workout.duration} min</span>
//                         <span className="stat-pill">{workout.exercises.length} exercises</span>
//                       </div>

//                       {workout.bodyParts && workout.bodyParts.length > 0 && (
//                         <div className="body-parts small">
//                           {workout.bodyParts.slice(0, 3).map(part => (
//                             <span key={part} className="body-part-tag small">
//                               {part.charAt(0).toUpperCase() + part.slice(1)}
//                             </span>
//                           ))}
//                           {workout.bodyParts.length > 3 && (
//                             <span className="body-part-tag small">+{workout.bodyParts.length - 3}</span>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <Link
//                       to={`/workout/${workout._id}`}
//                       className="view-workout-link"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </section>
//       </main>

//       <footer className="dashboard-footer">
//         <p>© 2025 Workout Tracker. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    totalWorkouts: 0,
    weeklyWorkouts: 0,
    mostTrained: "-",
    recentWorkouts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/users/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData({
          username: response.data.username || "User",
          totalWorkouts: response.data.totalWorkouts || 0,
          weeklyWorkouts: response.data.weeklyWorkouts || 0,
          mostTrained: response.data.mostTrained || "-",
          recentWorkouts: response.data.recentWorkouts || [],
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddWorkout = () => {
    navigate("/add-workout");
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Workout Tracker</h1>
        <div className="user-info">
          <span>Welcome, {userData.username}!</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li>
            <Link to="/dashboard" className="active">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/add-workout">Add Workout</Link>
          </li>
          <li>
            <Link to="/workout-history">Workout History</Link>
          </li>
        </ul>
      </nav>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Workouts</h3>
          <div className="stat-value">{userData.totalWorkouts}</div>
        </div>
        <div className="stat-card">
          <h3>This Week</h3>
          <div className="stat-value">{userData.weeklyWorkouts}</div>
        </div>
        <div className="stat-card">
          <h3>Most Trained</h3>
          <div className="stat-value">{userData.mostTrained}</div>
        </div>
      </div>
      {/* 
      <section className="latest-workout-section">
        <div className="section-header">
          <h2>Latest Workout</h2>
          <button className="add-workout-button" onClick={handleAddWorkout}>
            + Add Workout
          </button>
        </div>

        <div className="latest-workout-card">
          {userData.recentWorkouts.length > 0 ? (
            <div className="workout-details">
              <h3>{userData.recentWorkouts[0].workoutType}</h3>
              <div className="workout-info">
                <span>
                  {new Date(
                    userData.recentWorkouts[0].date
                  ).toLocaleDateString()}
                </span>
                <span>{userData.recentWorkouts[0].duration} minutes</span>
                <span className="intensity">
                  {userData.recentWorkouts[0].intensity} intensity
                </span>
              </div>

               
              <div className="workout-body-parts">
                <strong>Trained Body Parts:</strong>
                {Array.isArray(userData.recentWorkouts[0].bodyParts) &&
                userData.recentWorkouts[0].bodyParts.length > 0 ? (
                  <ul>
                    {userData.recentWorkouts[0].bodyParts.map((part, index) => (
                      <li key={index}>{part}</li>
                    ))}
                  </ul>
                ) : (
                  <span>No specific body parts selected.</span>
                )}
              </div>

              <p>{userData.recentWorkouts[0].notes}</p>
            </div>
          ) : (
            <div className="no-workouts">
              <p>You haven't recorded any workouts yet.</p>
              <button className="primary-button" onClick={handleAddWorkout}>
                Add Your First Workout
              </button>
            </div>
          )}
        </div>
      </section>  */}

      <section className="recent-workouts-section">
        <div className="section-header">
          <h2>Recent Workouts</h2>
          <Link to="/workout-history" className="view-all">
            View All
          </Link>
        </div>

        {userData.recentWorkouts.length > 0 ? (
          <div className="recent-workouts-list">
            {userData.recentWorkouts
              .slice() // Create a shallow copy of the array to avoid mutating the original array
              .reverse() // Reverse the array
              .map((workout, index) => {
                // Determine the intensity color for the border
                let borderColor = "#007bff"; // Default blue for undefined intensity
                if (workout.intensity === "low") {
                  borderColor = "#28a745"; // Green for low
                } else if (workout.intensity === "medium") {
                  borderColor = "#ffc107"; // Yellow for medium
                } else if (workout.intensity === "high") {
                  borderColor = "#dc3545"; // Red for high
                }

                return (
                  <div
                    key={index}
                    className="workout-item"
                    style={{ borderLeftColor: borderColor }} // Apply dynamic border color
                  >
                    <div className="workout-item-header">
                      <h4>{workout.workoutType}</h4>
                      <span className="workout-date">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="workout-item-details">
                      <span>Time Spent on Workout : {workout.duration} Min.</span>
                      <span className={`intensity ${workout.intensity}`}>
                        {workout.intensity}
                      </span>

                      {/* Display trained body parts */}
                      {workout.bodyParts && workout.bodyParts.length > 0 && (
                        <>
                          <div className="workout-body-parts">
                            <strong>Focused on:</strong>
                          </div>
                          <ul className="body-parts-list">
                            {workout.bodyParts.map((part, idx) => (
                              <li key={idx}>{part}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="no-data-message">No previous workouts to display.</p>
        )}
      </section>

      <footer className="dashboard-footer">
        <p>
          &copy; {new Date().getFullYear()} Workout Tracker. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
