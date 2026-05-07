import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Loans from './pages/Loans';
import Payments from './pages/Payments';
import Applications from './pages/Applications';
import './styles/Login.css';
import './styles/Dashboard.css';
import './styles/Pages.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div style={{color:'white', display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Loading...</div>;

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/clients" element={user ? <Clients /> : <Navigate to="/" />} />
        <Route path="/loans" element={user ? <Loans /> : <Navigate to="/" />} />
        <Route path="/payments" element={user ? <Payments /> : <Navigate to="/" />} />
        <Route path="/applications" element={user ? <Applications /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;