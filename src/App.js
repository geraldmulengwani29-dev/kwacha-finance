import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Loans from './pages/Loans';
import Payments from './pages/Payments';
import Applications from './pages/Applications';
import ClientDashboard from './pages/ClientDashboard';
import Reports from './pages/Reports';
import ClientProfile from './pages/ClientProfile';
import AdminProfile from './pages/AdminProfile';
import './styles/Login.css';
import './styles/Dashboard.css';
import './styles/Pages.css';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const clientDoc = await getDoc(doc(db, 'clients', currentUser.uid));
          if (clientDoc.exists()) {
            setRole(clientDoc.data().role || 'client');
          } else {
            // SECURITY: Fail closed by defaulting missing user profiles to 'client' role rather than 'admin'
            setRole('client');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          // SECURITY: Default to least privileged role on error
          setRole('client');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div style={{color:'white', display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Loading...</div>;

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={!user ? <Login /> : role === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/client-dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/client-dashboard" />} />
        <Route path="/dashboard" element={user && role === 'admin' ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/clients" element={user && role === 'admin' ? <Clients /> : <Navigate to="/" />} />
        <Route path="/clients/:clientId" element={user && role === 'admin' ? <ClientProfile /> : <Navigate to="/" />} />
        <Route path="/loans" element={user && role === 'admin' ? <Loans /> : <Navigate to="/" />} />
        <Route path="/payments" element={user && role === 'admin' ? <Payments /> : <Navigate to="/" />} />
        <Route path="/applications" element={user && role === 'admin' ? <Applications /> : <Navigate to="/" />} />
        <Route path="/reports" element={user && role === 'admin' ? <Reports /> : <Navigate to="/" />} />
        <Route path="/admin-profile" element={user && role === 'admin' ? <AdminProfile /> : <Navigate to="/" />} />
        <Route path="/client-dashboard" element={user && role === 'client' ? <ClientDashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;