import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeLoans: 0,
    totalDisbursed: 0,
    pendingApplications: 0,
  });
  const [overdueLoans, setOverdueLoans] = useState([]);

  const getWeeksPassed = (startDate) => {
    if (!startDate) return 0;
    const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
    return Math.floor((new Date() - start) / (1000 * 60 * 60 * 24 * 7));
  };

  const fetchStats = async () => {
    const clientsSnap = await getDocs(collection(db, 'clients'));
    const loansSnap = await getDocs(collection(db, 'loans'));
    const appsSnap = await getDocs(collection(db, 'applications'));
    const paymentsSnap = await getDocs(collection(db, 'payments'));

    const loans = loansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const apps = appsSnap.docs.map(doc => doc.data());
    const payments = paymentsSnap.docs.map(doc => doc.data());

    const activeLoans = loans.filter(l => l.status === 'active');
    const totalDisbursed = activeLoans.reduce((sum, l) => sum + l.amount, 0);
    const pendingApps = apps.filter(a => a.status === 'pending' || a.status === 'countered');

    const overdue = activeLoans.filter(loan => {
      const weeks = getWeeksPassed(loan.startDate);
      if (weeks < 1) return false;
      const loanPayments = payments.filter(p => p.loanId === loan.id);
      const totalPaid = loanPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const principal = parseFloat(loan.amount);
      const totalOwed = principal + (principal * 0.10 * weeks);
      return totalPaid < totalOwed;
    });

    setOverdueLoans(overdue);
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

  return (
    <div className="dashboard-container">
      <Sidebar />
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

        {overdueLoans.length > 0 && (
          <div style={{marginTop:'30px'}}>
            <h2 style={{color:'#e74c3c', marginBottom:'15px'}}>
              ⚠️ Overdue Loans ({overdueLoans.length})
            </h2>
            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Loan Amount (K)</th>
                    <th>Weeks Overdue</th>
                    <th>Total Owed (K)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueLoans.map(loan => {
                    const weeks = getWeeksPassed(loan.startDate);
                    const principal = parseFloat(loan.amount);
                    const totalOwed = principal + (principal * 0.10 * weeks);
                    return (
                      <tr key={loan.id} style={{background:'rgba(231,76,60,0.05)'}}>
                        <td style={{color:'#e74c3c', fontWeight:'600'}}>{loan.clientName}</td>
                        <td>K{loan.amount}</td>
                        <td>
                          <span style={{background:'rgba(231,76,60,0.2)', color:'#e74c3c', padding:'4px 10px', borderRadius:'20px', fontSize:'13px', fontWeight:'600'}}>
                            {weeks} {weeks === 1 ? 'week' : 'weeks'}
                          </span>
                        </td>
                        <td style={{color:'#e74c3c', fontWeight:'700'}}>K{totalOwed.toFixed(2)}</td>
                        <td>
                          <button
                            onClick={() => navigate('/payments')}
                            style={{padding:'6px 14px', background:'#e74c3c', border:'none', borderRadius:'8px', color:'white', fontWeight:'600', cursor:'pointer', fontSize:'13px'}}
                          >
                            Record Payment
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {overdueLoans.length === 0 && (
          <div style={{marginTop:'30px', padding:'20px', background:'rgba(39,174,96,0.1)', borderRadius:'12px', border:'1px solid rgba(39,174,96,0.3)', textAlign:'center'}}>
            <p style={{color:'#27ae60', fontWeight:'600', margin:0}}>✅ No overdue loans — all clients are on track</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;