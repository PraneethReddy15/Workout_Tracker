// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Dashboard from './components/Dashboard';
// import './App.css';

// // Protected Route component
// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
  
//   if (!token) {
//     return <Navigate to="/login" />;
//   }
  
//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <div className="app">
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } 
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddWorkout from './components/AddWorkout';
import WorkoutHistory from './components/WorkoutHistory';
// import BodyPartSelector from './components/BodyPartSelector';
import './App.css';

// Simple auth check - in a real app, you would verify the token with your backend
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-workout" 
            element={
              <ProtectedRoute>
                <AddWorkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workout-history" 
            element={
              <ProtectedRoute>
                <WorkoutHistory />
              </ProtectedRoute>
            } 
          />
          {/* <Route 
            path="/body-selector" 
            element={
              <ProtectedRoute>
                <BodyPartSelector />
              </ProtectedRoute>
            } 
          /> */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;