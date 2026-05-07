import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [counterOffer, setCounterOffer] = useState({});
  const [form, setForm] = useState({
    clientId: '',
    requestedAmount: '',
    collateral: '',
    reason: '',
  });

  const fetchData = async () => {
    const appsSnap = await getDocs(collection(db, 'applications'));
    const clientsSnap = await getDocs(collection(db, 'clients'));
    setApplications(appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setClients(clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const client = clients.find(c => c.id === form.clientId);
    try {
      await addDoc(collection(db, 'applications'), {
        ...form,
        clientName: client.fullName,
        requestedAmount: parseFloat(form.requestedAmount),
        status: 'pending',
        createdAt: new Date(),
        offeredAmount: null,
        clientResponse: null,
      });
      toast.success('Application submitted!');
      setForm({ clientId: '', requestedAmount: '', collateral: '', reason: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error('Error submitting application');
    }
    setLoading(false);
  };

  const handleCounterOffer = async (appId) => {
    const offered = counterOffer[appId];
    if (!offered) return toast.error('Enter an offer amount');
    try {
      await updateDoc(doc(db, 'applications', appId), {
        offeredAmount: parseFloat(offered),
        status: 'countered',
      });
      toast.success('Counter offer sent!');
      setCounterOffer({});
      fetchData();
    } catch (error) {
      toast.error('Error sending counter offer');
    }
  };

  const handleApprove = async (appId) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: 'approved',
        clientResponse: 'accepted',
      });
      toast.success('Application approved!');
      fetchData();
    } catch (error) {
      toast.error('Error approving application');
    }
  };

  const handleReject = async (appId) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: 'rejected',
      });
      toast.success('Application rejected!');
      fetchData();
    } catch (error) {
      toast.error('Error rejecting application');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
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
      </div>
      <div className="page-container">
        <div className="page-header">
          <h1>Applications</h1>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Application'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>New Loan Application</h2>
            <form onSubmit={handleSubmit} className="grid-form">
              <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})} required>
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.fullName}</option>
                ))}
              </select>
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
              />
              <button type="submit" className="submit-btn full-width" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Requested (K)</th>
                <th>Collateral</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No applications yet</td></tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id}>
                    <td>{app.clientName}</td>
                    <td>K{app.requestedAmount}</td>
                    <td>{app.collateral}</td>
                    <td><span className={`badge ${app.status}`}>{app.status}</span></td>
                    <td>{formatDate(app.createdAt)}</td>
                    <td>
                      {app.status === 'pending' && (
                        <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                          <input
                            type="number"
                            placeholder="Counter offer"
                            value={counterOffer[app.id] || ''}
                            onChange={e => setCounterOffer({...counterOffer, [app.id]: e.target.value})}
                            style={{width:'120px', padding:'6px 10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white'}}
                          />
                          <button onClick={() => handleCounterOffer(app.id)} style={{padding:'6px 12px', background:'#c9a84c', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600'}}>
                            Counter
                          </button>
                          <button onClick={() => handleApprove(app.id)} style={{padding:'6px 12px', background:'#27ae60', border:'none', borderRadius:'8px', cursor:'pointer', color:'white', fontWeight:'600'}}>
                            Approve
                          </button>
                          <button onClick={() => handleReject(app.id)} style={{padding:'6px 12px', background:'#e74c3c', border:'none', borderRadius:'8px', cursor:'pointer', color:'white', fontWeight:'600'}}>
                            Reject
                          </button>
                        </div>
                      )}
                      {app.status === 'countered' && (
                        <span style={{color:'#c9a84c'}}>Offered: K{app.offeredAmount} - Awaiting response</span>
                      )}
                      {app.status === 'approved' && (
                        <span style={{color:'#27ae60'}}>✅ Approved</span>
                      )}
                      {app.status === 'rejected' && (
                        <span style={{color:'#e74c3c'}}>❌ Rejected</span>
                      )}
                    </td>
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

export default Applications;