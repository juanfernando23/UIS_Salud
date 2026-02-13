import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MyAppointments from './components/MyAppointments';
import ScheduleAppointment from './components/ScheduleAppointment';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('uis_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Get appointments for the current user from localStorage
  const getUserAppointments = () => {
    if (!user) return [];
    const all = JSON.parse(localStorage.getItem('uis_appointments') || '{}');
    return all[user.id] || [];
  };

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      setAppointments(getUserAppointments());
    } else {
      setAppointments([]);
    }
  }, [user]);

  const addAppointment = (appointment) => {
    const all = JSON.parse(localStorage.getItem('uis_appointments') || '{}');
    const userApps = all[user.id] || [];
    const newApp = {
      ...appointment,
      id: Date.now(),
      status: 'Confirmada',
      createdAt: new Date().toISOString()
    };
    userApps.push(newApp);
    all[user.id] = userApps;
    localStorage.setItem('uis_appointments', JSON.stringify(all));
    setAppointments([...userApps]);
    return newApp;
  };

  const cancelAppointment = (appointmentId) => {
    const all = JSON.parse(localStorage.getItem('uis_appointments') || '{}');
    const userApps = all[user.id] || [];
    const updated = userApps.map(app => 
      app.id === appointmentId ? { ...app, status: 'Cancelada', cancelledAt: new Date().toISOString() } : app
    );
    all[user.id] = updated;
    localStorage.setItem('uis_appointments', JSON.stringify(all));
    setAppointments([...updated]);
  };

  const rescheduleAppointment = (appointmentId, newDetails) => {
    const all = JSON.parse(localStorage.getItem('uis_appointments') || '{}');
    const userApps = all[user.id] || [];
    const updated = userApps.map(app => 
      app.id === appointmentId 
        ? { ...app, ...newDetails, updatedAt: new Date().toISOString() } 
        : app
    );
    all[user.id] = updated;
    localStorage.setItem('uis_appointments', JSON.stringify(all));
    setAppointments([...updated]);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('uis_current_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('uis_current_user');
  };

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} appointments={appointments} /> : <Navigate to="/login" />} />
          <Route path="/my-appointments" element={user ? <MyAppointments appointments={appointments} onCancel={cancelAppointment} /> : <Navigate to="/login" />} />
          <Route path="/schedule" element={user ? <ScheduleAppointment onAdd={addAppointment} onUpdate={rescheduleAppointment} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
