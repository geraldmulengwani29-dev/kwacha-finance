import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import logo from '../KWACHA.png';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    requestedAmount: '',
    collateral: '',
    reason: '',
  });

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const clientSnap = await getDocs(query(collection(db, 'clients'), where('email', '==', user.email)));
    if (!clientSnap.empty) setClientData(clientSnap.docs[0].data());

    const loansSnap = await getDocs(query(collection(db, 'loans'), where('clientEmail', '==', user.email)));
    setLoans(loansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const paymentsSnap = await getDocs(query(collection(db, 'payments'), where('clientEmail', '==', user.email)));
    setPayments(paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const appsSnap = await getDocs(query(collection(db, 'applications'), where('clientEmail', '==', user.email)));
    setApplications(appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = auth.currentUser;
    try {
      await addDoc(collection(db, 'applications'), {
        clientEmail: user.email,
        clientName: clientData?.fullName || user.email,
        requestedAmount: parseFloat(form.requestedAmount),
        collateral: form.collateral,
        reason: form.reason,
        status: 'pending',
        createdAt: new Date(),
        offeredAmount: null,
        clientResponse: null,
      });
      toast.success('Application submitted successfully!');
      setForm({ requestedAmount: '', collateral: '', reason: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error('Error submitting application');
    }
    setLoading(false);
  };

  const handleAcceptOffer = async (appId) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: 'approved',
        clientResponse: 'accepted',
      });
      toast.success('Offer accepted!');
      fetchData();
    } catch (error) {
      toast.error('Error accepting offer');
    }
  };

  const handleDeclineOffer = async (appId) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: 'rejected',
        clientResponse: 'declined',
      });
      toast.success('Offer declined!');
      fetchData();
    } catch (error) {
      toast.error('Error declining offer');
    }
  };

  const calculateTotalOwed = (amount, startDate) => {
    if (!amount || !startDate) return amount;
    const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
    const weeks = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24 * 7));
    const principal = parseFloat(amount);
    const total = principal + (principal * 0.10 * weeks);
    return total.toFixed(2);
  };

  const generateRepaymentSchedule = (amount, startDate, weeks = 8) => {
    const schedule = [];
    const principal = parseFloat(amount);
    const start = startDate?.toDate ? startDate.toDate() : new Date();
    for (let i = 1; i <= weeks; i++) {
      const totalOwed = principal + (principal * 0.10 * i);
      const dueDate = new Date(start);
      dueDate.setDate(dueDate.getDate() + (i * 7));
      schedule.push({
        week: i,
        dueDate: dueDate.toLocaleDateString(),
        totalOwed: totalOwed.toFixed(2),
      });
    }
    return schedule;
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div style={{ textAlign: 'center', padding: '20px 0 5px' }}>
          <img
            src={logo}
            alt="Kwacha Finance"
            style={{ width: '120px', height: 'auto' }}
          />
        </div>
        <p style={{color:'rgba(255,255,255,0.5)', fontSize:'13px', textAlign:'center', marginBottom:'30px'}}>
          {clientData?.fullName}
        </p>
        <nav>
          <ul>
            <li>📊 My Dashboard</li>
            <li onClick={() => setShowForm(!showForm)}>📋 Apply for Loan</li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
      </div>
      <div className="page-container">
        <div className="page-header">
          <h1>My Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{marginBottom:'30px'}}>
          <div className="stat-card">
            <h3>Active Loans</h3>
            <p>{loans.filter(l => l.status === 'active').length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Applications</h3>
            <p>{applications.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className="stat-card">
            <h3>Counter Offers</h3>
            <p>{applications.filter(a => a.status === 'countered').length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Payments</h3>
            <p>{payments.length}</p>
          </div>
        </div>

        {/* Loan Application Form */}
        {showForm && (
          <div className="form-card">
            <h2>New Loan Application</h2>
            <form onSubmit={handleSubmitApplication} className="grid-form">
              <input
                type="number"
                placeholder="Requested Amount (K)"
                value={form.requestedAmount}
                onChange={e => setForm({...form, requestedAmount: e.target.value})}
                required
              />
              <input
                placeholder="Collateral (or type 'None')"
                value={form.collateral}
                onChange={e => setForm({...form, collateral: e.target.value})}
                required
              />
              <input
                placeholder="Reason for loan"
                value={form.reason}
                onChange={e => setForm({...form, reason: e.target.value})}
                required
                className="full-width"
              />
              <button type="submit" className="submit-btn full-width" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {/* Counter Offers */}
        {applications.filter(a => a.status === 'countered').length > 0 && (
          <div className="form-card" style={{borderColor:'rgba(201, 168, 76, 0.5)'}}>
            <h2>⚡ Counter Offers - Action Required</h2>
            {applications.filter(a => a.status === 'countered').map(app => (
              <div key={app.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'rgba(201,168,76,0.1)', borderRadius:'10px', marginBottom:'10px'}}>
                <div>
                  <p style={{color:'white'}}>You requested: <strong>K{app.requestedAmount}</strong></p>
                  <p style={{color:'#c9a84c'}}>We are offering: <strong>K{app.offeredAmount}</strong></p>
                </div>
                <div style={{display:'flex', gap:'10px'}}>
                  <button onClick={() => handleAcceptOffer(app.id)} style={{padding:'10px 20px', background:'#27ae60', border:'none', borderRadius:'8px', color:'white', fontWeight:'700', cursor:'pointer'}}>
                    ✅ Accept
                  </button>
                  <button onClick={() => handleDeclineOffer(app.id)} style={{padding:'10px 20px', background:'#e74c3c', border:'none', borderRadius:'8px', color:'white', fontWeight:'700', cursor:'pointer'}}>
                    ❌ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Loans */}
        <div className="table-card" style={{marginBottom:'30px'}}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Amount (K)</th>
                <th>Collateral</th>
                <th>Weeks</th>
                <th>Total Owed (K)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No loans yet</td></tr>
              ) : (
                loans.map(loan => (
                  <tr key={loan.id}>
                    <td>K{loan.amount}</td>
                    <td>{loan.collateral}</td>
                    <td>{Math.floor((new Date() - (loan.startDate?.toDate ? loan.startDate.toDate() : new Date())) / (1000 * 60 * 60 * 24 * 7))}</td>
                    <td>K{calculateTotalOwed(loan.amount, loan.startDate)}</td>
                    <td><span className={`badge ${loan.status}`}>{loan.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Repayment Schedule */}
        {loans.filter(l => l.status === 'active').map(loan => (
          <div key={loan.id} className="form-card" style={{marginBottom:'30px'}}>
            <h2>📅 Repayment Schedule - K{loan.amount} Loan</h2>
            <p style={{color:'rgba(255,255,255,0.5)', marginBottom:'20px', fontSize:'14px'}}>
              10% interest added every week
            </p>
            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Week</th>
                    <th>Due Date</th>
                    <th>Total Owed (K)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {generateRepaymentSchedule(loan.amount, loan.startDate).map(row => {
                    const weeksPassed = Math.floor((new Date() - (loan.startDate?.toDate ? loan.startDate.toDate() : new Date())) / (1000 * 60 * 60 * 24 * 7));
                    const isPast = row.week <= weeksPassed;
                    const isCurrent = row.week === weeksPassed + 1;
                    return (
                      <tr key={row.week} style={{background: isCurrent ? 'rgba(201,168,76,0.1)' : isPast ? 'rgba(231,76,60,0.05)' : 'transparent'}}>
                        <td>Week {row.week}</td>
                        <td>{row.dueDate}</td>
                        <td style={{color: isCurrent ? '#c9a84c' : isPast ? '#e74c3c' : 'rgba(255,255,255,0.8)'}}>
                          K{row.totalOwed}
                        </td>
                        <td>
                          {isPast ? <span className="badge rejected">Overdue</span> :
                           isCurrent ? <span className="badge pending">Due Now</span> :
                           <span className="badge active">Upcoming</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* My Applications */}
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Requested (K)</th>
                <th>Collateral</th>
                <th>Status</th>
                <th>Offered (K)</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No applications yet</td></tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id}>
                    <td>K{app.requestedAmount}</td>
                    <td>{app.collateral}</td>
                    <td><span className={`badge ${app.status}`}>{app.status}</span></td>
                    <td>{app.offeredAmount ? `K${app.offeredAmount}` : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;