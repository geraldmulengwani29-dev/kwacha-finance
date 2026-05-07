import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeLoans: 0,
    totalDisbursed: 0,
    pendingApplications: 0,
  });

  const fetchStats = async () => {
    const clientsSnap = await getDocs(collection(db, 'clients'));
    const loansSnap = await getDocs(collection(db, 'loans'));
    const appsSnap = await getDocs(collection(db, 'applications'));

    const loans = loansSnap.docs.map(doc => doc.data());
    const apps = appsSnap.docs.map(doc => doc.data());

    const activeLoans = loans.filter(l => l.status === 'active');
    const totalDisbursed = activeLoans.reduce((sum, l) => sum + l.amount, 0);
    const pendingApps = apps.filter(a => a.status === 'pending' || a.status === 'countered');

    setStats({
      totalClients: clientsSnap.size,
      activeLoans: activeLoans.length,
      totalDisbursed: totalDisbursed,
      pendingApplications: pendingApps.length,
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Kwacha Finance</h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/dashboard')}>📊 Dashboard</li>
            <li onClick={() => navigate('/clients')}>👥 Clients</li>
            <li onClick={() => navigate('/loans')}>💰 Loans</li>
            <li onClick={() => navigate('/payments')}>💳 Payments</li>
            <li onClick={() => navigate('/applications')}>📋 Applications</li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Clients</h3>
            <p>{stats.totalClients}</p>
          </div>
          <div className="stat-card">
            <h3>Active Loans</h3>
            <p>{stats.activeLoans}</p>
          </div>
          <div className="stat-card">
            <h3>Total Disbursed</h3>
            <p>K{stats.totalDisbursed.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Applications</h3>
            <p>{stats.pendingApplications}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;