import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
// 1. IMPORT YOUR NEW COMPONENTS HERE
import Signup from './components/Auth/Signup'; 
import GetStarted from './pages/GetStarted'; 

import Dashboard from './pages/Dashboard'; 
import ResumeEditor from './pages/ResumeEditor';
import Profile from './pages/Profile';
import ATSChecker from './pages/ATSChecker';

function App() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <Router>
      <Routes>
        {/* 2. ADD THE NEW ROUTES BELOW */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/get-started" element={<GetStarted />} />

        {/* Existing Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume-builder" element={<ResumeEditor />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ats-checker" element={<ATSChecker />} />

        {/* Redirect empty path to get-started or dashboard */}
        <Route path="/" element={<Navigate to="/get-started" />} />
      </Routes>
    </Router>
  );
}

export default App;