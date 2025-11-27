import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CaptainLogin from './pages/CaptainLogin';
import CaptainDashboard from './pages/CaptainDashboard';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/captain-login" element={<CaptainLogin />} />
          <Route path="/captain-dashboard" element={<CaptainDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
