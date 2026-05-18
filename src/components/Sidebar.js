import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../KWACHA.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingApps, setPendingApps] = useState(0);
  const [overdueLoans, setOverdueLoans] = useState(0);

  const getWeeksPassed = (startDate) => {
    if (!startDate) return 0;
    const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
    return Math.floor((new Date() - start) / (1000 * 60 * 60 * 24 * 7));
  };

  const fetchBadges = async () => {
    const appsSnap = await getDocs(collection(db, 'applications'));
    const loansSnap = await getDocs(collection(db, 'loans'));
    const paymentsSnap = await getDocs(collection(db, 'payments'));

    const apps = appsSnap.docs.map(d => d.data());
    const loans = loansSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const payments = paymentsSnap.docs.map(d => d.data());

    const pending = apps.filter(a => a.status === 'pending' || a.status === 'countered').length;
    setPendingApps(pending);

    const activeLoans = loans.filter(l => l.status === 'active');
    const overdue = activeLoans.filter(loan => {
      const weeks = getWeeksPassed(loan.startDate);
      if (weeks < 1) return false;
      const principal = parseFloat(loan.amount);
      const owed = principal + (principal * 0.10 * weeks);
      const paid = payments.filter(p => p.loanId === loan.id).reduce((s, p) => s + parseFloat(p.amount), 0);
      return paid < owed;
    }).length;
    setOverdueLoans(overdue);
  };

  useEffect(() => {
    fetchBadges();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItem = (path, icon, label, badge = 0) => (
    <li
      onClick={() => navigate(path)}
      style={{
        background: isActive(path) ? 'rgba(201,168,76,0.15)' : 'transparent',
        borderLeft: isActive(path) ? '3px solid #c9a84c' : '3px solid transparent',
        paddingLeft: isActive(path) ? '13px' : '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>{icon} {label}</span>
      {badge > 0 && (
        <span style={{
          background: '#e74c3c',
          color: 'white',
          borderRadius: '10px',
          padding: '2px 7px',
          fontSize: '11px',
          fontWeight: '700',
          minWidth: '18px',
          textAlign: 'center',
        }}>
          {badge}
        </span>
      )}
    </li>
  );

  return (
    <div className="sidebar">
      <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
        <img src={logo} alt="Kwacha Finance" style={{ width: '120px', height: 'auto' }} />
      </div>
      <nav>
        <ul>
          {navItem('/dashboard', '📊', 'Dashboard')}
          {navItem('/clients', '👥', 'Clients')}
          {navItem('/loans', '💰', 'Loans', overdueLoans)}
          {navItem('/payments', '💳', 'Payments')}
          {navItem('/applications', '📋', 'Applications', pendingApps)}
          {navItem('/reports', '📈', 'Reports')}
          {navItem('/admin-profile', '⚙️', 'My Profile')}
        </ul>
      </nav>
      <button onClick={handleLogout} className="logout-btn">
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;