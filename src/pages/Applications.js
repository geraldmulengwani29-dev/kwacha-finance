import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [counterOffer, setCounterOffer] = useState({});
  const [form, setForm] = useState({ clientId: '', requestedAmount: '', collateral: '', reason: '' });

  const fetchData = async () => {
    const appsSnap = await getDocs(collection(db, 'applications'));
    const clientsSnap = await getDocs(collection(db, 'clients'));
    setApplications(appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setClients(clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const client = clients.find(c => c.id === form.clientId);
    try {
      await addDoc(collection(db, 'applications'), {
        ...form, clientName: client.fullName, clientEmail: client.email,
        requestedAmount: parseFloat(form.requestedAmount), status: 'pending',
        createdAt: new Date(), offeredAmount: null, clientResponse: null,
      });
      toast.success('Application submitted!');
      setForm({ clientId: '', requestedAmount: '', collateral: '', reason: '' });
      setShowForm(false);
      fetchData();
    } catch (error) { toast.error('Error submitting application'); }
    setLoading(false);
  };

  const createLoan = async (app, amount) => {
    let clientEmail = app.clientEmail;
    if (!clientEmail) {
      const clientSnap = await getDocs(query(collection(db, 'clients'), where('fullName', '==', app.clientName)));
      if (!clientSnap.empty) clientEmail = clientSnap.docs[0].data().email;
    }
    await addDoc(collection(db, 'loans'), {
      clientName: app.clientName, clientEmail: clientEmail || '',
      amount: parseFloat(amount), collateral: app.collateral, interestRate: 10,
      status: 'active', startDate: new Date(), weeksPassed: 0,
      totalOwed: parseFloat(amount), notes: app.reason || '',
    });
  };

  const handleSyncMissingLoans = async () => {
    setSyncing(true);
    try {
      const appsSnap = await getDocs(collection(db, 'applications'));
      const loansSnap = await getDocs(collection(db, 'loans'));
      const allApps = appsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const allLoans = loansSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const approvedApps = allApps.filter(a => a.status === 'approved');
      let created = 0;
      for (const app of approvedApps) {
        const clientEmail = app.clientEmail || '';
        const amount = app.offeredAmount || app.requestedAmount;
        const alreadyExists = allLoans.some(l => l.clientEmail === clientEmail && parseFloat(l.amount) === parseFloat(amount));
        if (!alreadyExists) { await createLoan(app, amount); created++; }
      }
      created === 0 ? toast.info('All approved applications already have loans.') : toast.success(`${created} missing loan(s) created!`);
      fetchData();
    } catch (error) { toast.error('Error syncing loans'); }
    setSyncing(false);
  };

  const handleCounterOffer = async (appId) => {
    const offered = counterOffer[appId];
    if (!offered) return toast.error('Enter an offer amount');
    try {
      await updateDoc(doc(db, 'applications', appId), { offeredAmount: parseFloat(offered), status: 'countered' });
      toast.success('Counter offer sent!');
      setCounterOffer({});
      fetchData();
    } catch (error) { toast.error('Error sending counter offer'); }
  };

  const handleApprove = async (appId) => {
    const app = applications.find(a => a.id === appId);
    try {
      await updateDoc(doc(db, 'applications', appId), { status: 'approved', clientResponse: 'accepted' });
      await createLoan(app, app.requestedAmount);
      toast.success('Application approved and loan created!');
      fetchData();
    } catch (error) { toast.error('Error approving application'); }
  };

  const handleReject = async (appId) => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status: 'rejected' });
      toast.success('Application rejected!');
      fetchData();
    } catch (error) { toast.error('Error rejecting application'); }
  };

  const handleArchive = async (appId) => {
    if (!window.confirm('Archive this application?')) return;
    try {
      await updateDoc(doc(db, 'applications', appId), { status: 'archived', archivedAt: new Date() });
      toast.success('Application archived.');
      fetchData();
    } catch (error) { toast.error('Error archiving application'); }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm('Permanently delete this application? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'applications', appId));
      toast.success('Application deleted.');
      fetchData();
    } catch (error) { toast.error('Error deleting application'); }
  };

  const handleRestore = async (appId) => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status: 'rejected', archivedAt: null });
      toast.success('Application restored.');
      fetchData();
    } catch (error) { toast.error('Error restoring application'); }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  const visibleApps = applications.filter(a => showArchived ? a.status === 'archived' : a.status !== 'archived');
  const archivedCount = applications.filter(a => a.status === 'archived').length;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <h1>Applications</h1>
          <div style={{display:'flex', gap:'10px'}}>
            <button onClick={handleSyncMissingLoans} disabled={syncing} style={{padding:'10px 18px', background:'rgba(201,168,76,0.15)', border:'1px solid #c9a84c', borderRadius:'8px', color:'#c9a84c', fontWeight:'600', cursor:'pointer'}}>
              {syncing ? 'Syncing...' : '🔄 Sync Missing Loans'}
            </button>
            {archivedCount > 0 && (
              <button onClick={() => setShowArchived(!showArchived)} style={{padding:'10px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'rgba(255,255,255,0.7)', cursor:'pointer'}}>
                {showArchived ? '📋 Show Active' : `🗄️ Archived (${archivedCount})`}
              </button>
            )}
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ New Application'}</button>
          </div>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>New Loan Application</h2>
            <form onSubmit={handleSubmit} className="grid-form">
              <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})} required>
                <option value="">Select Client</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.fullName}</option>)}
              </select>
              <input type="number" placeholder="Requested Amount (K)" value={form.requestedAmount} onChange={e => setForm({...form, requestedAmount: e.target.value})} required />
              <input placeholder="Collateral (or type 'None')" value={form.collateral} onChange={e => setForm({...form, collateral: e.target.value})} required />
              <input placeholder="Reason for loan" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required />
              <button type="submit" className="submit-btn full-width" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
            </form>
          </div>
        )}

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr><th>Client</th><th>Requested (K)</th><th>Collateral</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {visibleApps.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>
                  {showArchived ? 'No archived applications' : 'No applications yet'}
                </td></tr>
              ) : (
                visibleApps.map(app => (
                  <tr key={app.id} style={{opacity: app.status === 'archived' ? 0.6 : 1}}>
                    <td>{app.clientName}</td>
                    <td>K{app.requestedAmount}</td>
                    <td>{app.collateral}</td>
                    <td><span className={`badge ${app.status}`}>{app.status}</span></td>
                    <td>{formatDate(app.createdAt)}</td>
                    <td>
                      {app.status === 'archived' ? (
                        <div style={{display:'flex', gap:'6px'}}>
                          <button onClick={() => handleRestore(app.id)} style={{padding:'5px 10px', background:'#c9a84c', border:'none', borderRadius:'6px', color:'#1a2634', fontWeight:'600', cursor:'pointer', fontSize:'12px'}}>↩ Restore</button>
                          <button onClick={() => handleDelete(app.id)} style={{padding:'5px 10px', background:'#e74c3c', border:'none', borderRadius:'6px', color:'white', fontWeight:'600', cursor:'pointer', fontSize:'12px'}}>🗑 Delete</button>
                        </div>
                      ) : (
                        <div style={{display:'flex', gap:'6px', alignItems:'center', flexWrap:'wrap'}}>
                          {app.status === 'pending' && (
                            <>
                              <input type="number" placeholder="Counter offer" value={counterOffer[app.id] || ''} onChange={e => setCounterOffer({...counterOffer, [app.id]: e.target.value})} style={{width:'110px', padding:'5px 8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'6px', color:'white', fontSize:'12px'}} />
                              <button onClick={() => handleCounterOffer(app.id)} style={{padding:'5px 10px', background:'#c9a84c', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'12px'}}>Counter</button>
                              <button onClick={() => handleApprove(app.id)} style={{padding:'5px 10px', background:'#27ae60', border:'none', borderRadius:'6px', cursor:'pointer', color:'white', fontWeight:'600', fontSize:'12px'}}>Approve</button>
                              <button onClick={() => handleReject(app.id)} style={{padding:'5px 10px', background:'#e74c3c', border:'none', borderRadius:'6px', cursor:'pointer', color:'white', fontWeight:'600', fontSize:'12px'}}>Reject</button>
                            </>
                          )}
                          {app.status === 'countered' && <span style={{color:'#c9a84c', fontSize:'12px'}}>Offered: K{app.offeredAmount} - Awaiting response</span>}
                          {app.status === 'approved' && <span style={{color:'#27ae60', fontSize:'12px'}}>✅ Approved</span>}
                          {app.status === 'rejected' && <span style={{color:'#e74c3c', fontSize:'12px'}}>❌ Rejected</span>}
                          {['approved', 'rejected', 'countered'].includes(app.status) && (
                            <button onClick={() => handleArchive(app.id)} style={{padding:'5px 10px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'6px', color:'rgba(255,255,255,0.7)', fontWeight:'600', cursor:'pointer', fontSize:'12px'}}>🗄 Archive</button>
                          )}
                        </div>
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