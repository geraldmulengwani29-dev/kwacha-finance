import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Loans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [extendingLoanId, setExtendingLoanId] = useState(null);
  const [extensionWeeks, setExtensionWeeks] = useState('');
  const [form, setForm] = useState({ clientId: '', amount: '', interestRate: 10, collateral: '', notes: '' });

  const fetchData = async () => {
    const loansSnap = await getDocs(collection(db, 'loans'));
    const clientsSnap = await getDocs(collection(db, 'clients'));
    setLoans(loansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setClients(clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchData(); }, []);

  const calculateRepayment = (amount, weeks) => {
    const principal = parseFloat(amount);
    return (principal + (principal * 0.10 * weeks)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const client = clients.find(c => c.id === form.clientId);
    try {
      await addDoc(collection(db, 'loans'), {
        ...form, clientName: client.fullName, clientEmail: client.email,
        amount: parseFloat(form.amount), interestRate: 10, status: 'active',
        startDate: new Date(), weeksPassed: 0, totalOwed: parseFloat(form.amount),
      });
      toast.success('Loan created successfully!');
      setForm({ clientId: '', amount: '', interestRate: 10, collateral: '', notes: '' });
      setShowForm(false);
      fetchData();
    } catch (error) { toast.error('Error creating loan'); }
    setLoading(false);
  };

  const handleMarkPaid = async (loanId) => {
    if (!window.confirm('Mark this loan as fully paid and close it?')) return;
    try {
      await updateDoc(doc(db, 'loans', loanId), { status: 'completed', paidAt: new Date() });
      toast.success('Loan marked as paid!');
      fetchData();
    } catch (error) { toast.error('Error updating loan'); }
  };

  const handleArchive = async (loanId) => {
    if (!window.confirm('Archive this loan?')) return;
    try {
      await updateDoc(doc(db, 'loans', loanId), { status: 'archived', archivedAt: new Date() });
      toast.success('Loan archived.');
      fetchData();
    } catch (error) { toast.error('Error archiving loan'); }
  };

  const handleDelete = async (loanId) => {
    if (!window.confirm('Permanently delete this loan? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'loans', loanId));
      toast.success('Loan deleted.');
      fetchData();
    } catch (error) { toast.error('Error deleting loan'); }
  };

  const handleRestore = async (loanId) => {
    try {
      await updateDoc(doc(db, 'loans', loanId), { status: 'completed', archivedAt: null });
      toast.success('Loan restored.');
      fetchData();
    } catch (error) { toast.error('Error restoring loan'); }
  };

  const handleExtend = async (loan) => {
    const weeks = parseInt(extensionWeeks);
    if (!weeks || weeks < 1) return toast.error('Enter a valid number of weeks');
    try {
      const currentStart = loan.startDate?.toDate ? loan.startDate.toDate() : new Date(loan.startDate);
      const newStart = new Date(currentStart);
      newStart.setDate(newStart.getDate() - (weeks * 7));
      await updateDoc(doc(db, 'loans', loan.id), {
        startDate: newStart,
        extensionWeeks: (loan.extensionWeeks || 0) + weeks,
        lastExtendedAt: new Date(),
      });
      toast.success(`Loan extended by ${weeks} week${weeks > 1 ? 's' : ''}!`);
      setExtendingLoanId(null);
      setExtensionWeeks('');
      fetchData();
    } catch (error) { toast.error('Error extending loan'); }
  };

  const getWeeksPassed = (startDate) => {
    if (!startDate) return 0;
    const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
    return Math.floor((new Date() - start) / (1000 * 60 * 60 * 24 * 7));
  };

  const archivedCount = loans.filter(l => l.status === 'archived').length;

  const filteredLoans = loans.filter(loan => {
    if (showArchived) return loan.status === 'archived';
    if (loan.status === 'archived') return false;
    if (statusFilter !== 'all' && loan.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return loan.clientName?.toLowerCase().includes(q) || loan.collateral?.toLowerCase().includes(q) || String(loan.amount).includes(q);
    }
    return true;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <h1>Loans</h1>
          <div style={{display:'flex', gap:'10px'}}>
            {archivedCount > 0 && (
              <button onClick={() => { setShowArchived(!showArchived); setSearch(''); setStatusFilter('all'); }} style={{padding:'10px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'rgba(255,255,255,0.7)', cursor:'pointer'}}>
                {showArchived ? '📋 Show Active' : `🗄️ Archived (${archivedCount})`}
              </button>
            )}
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ New Loan'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>New Loan</h2>
            <form onSubmit={handleSubmit} className="grid-form">
              <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})} required>
                <option value="">Select Client</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.fullName}</option>)}
              </select>
              <input type="number" placeholder="Loan Amount (K)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
              <input placeholder="Collateral (or type 'None')" value={form.collateral} onChange={e => setForm({...form, collateral: e.target.value})} required />
              <input placeholder="Interest Rate (%)" value="10% per week" disabled />
              <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="full-width" rows="3" style={{resize:'none'}} />
              <button type="submit" className="submit-btn full-width" disabled={loading}>{loading ? 'Saving...' : 'Create Loan'}</button>
            </form>
          </div>
        )}

        {!showArchived && (
          <div style={{display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap'}}>
            <input type="text" placeholder="🔍 Search by client name, amount or collateral..." value={search} onChange={e => setSearch(e.target.value)} style={{flex:1, minWidth:'200px', padding:'11px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'white', fontSize:'14px'}} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{padding:'11px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'white', fontSize:'14px', cursor:'pointer'}}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        {(search || statusFilter !== 'all') && !showArchived && (
          <p style={{color:'rgba(255,255,255,0.4)', fontSize:'13px', marginBottom:'10px'}}>{filteredLoans.length} loan{filteredLoans.length !== 1 ? 's' : ''} found</p>
        )}

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr><th>Client</th><th>Amount (K)</th><th>Collateral</th><th>Weeks</th><th>Total Owed (K)</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>
                  {showArchived ? 'No archived loans' : search || statusFilter !== 'all' ? 'No loans match your search' : 'No loans yet'}
                </td></tr>
              ) : (
                filteredLoans.map(loan => {
                  const weeks = getWeeksPassed(loan.startDate);
                  const totalOwed = calculateRepayment(loan.amount, weeks);
                  const isExtending = extendingLoanId === loan.id;
                  return (
                    <React.Fragment key={loan.id}>
                      <tr style={{opacity: loan.status === 'archived' ? 0.6 : 1}}>
                        <td>{loan.clientName}</td>
                        <td>K{loan.amount}</td>
                        <td>{loan.collateral}</td>
                        <td>
                          {weeks}
                          {loan.extensionWeeks > 0 && (
                            <span style={{color:'#c9a84c', fontSize:'11px', marginLeft:'5px'}}>(+{loan.extensionWeeks}w ext)</span>
                          )}
                        </td>
                        <td>K{totalOwed}</td>
                        <td><span className={`badge ${loan.status}`}>{loan.status}</span></td>
                        <td>
                          <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
                            {loan.status === 'active' && (
                              <>
                                <button onClick={() => handleMarkPaid(loan.id)} style={{padding:'5px 10px', background:'#27ae60', border:'none', borderRadius:'6px', color:'white', fontWeight:'600', cursor:'pointer', fontSize:'12px'}}>✅ Mark Paid</button>
                                <button
                                  onClick={() => { setExtendingLoanId(isExtending ? null : loan.id); setExtensionWeeks(''); }}
                                  style={{padding:'5px 10px', background: isExtending ? 'rgba(231,76,60,0.2)' : 'rgba(201,168,76,0.2)', border:`1px solid ${isExtending ? '#e74c3c' : '#c9a84c'}`, borderRadius:'6px', color: isExtending ? '#e74c3c' : '#c9a84c', fontWeight:'600', cursor:'pointer', fontSize:'12px'}}
                                >
                                  {isExtending ? '✕ Cancel' : '⏱ Extend'}
                                </button>
                              </>
                            )}
                            {loan.status === 'archived' ? (
                              <>
                                <button onClick={() => handleRestore(loan.id)} style={{padding:'5px 10px', background:'#c9a84c', border:'none', borderRadius:'6px', color:'#1a2634', fontWeight:'600', cursor:'pointer', fontSize:'12px'}}>↩ Restore</button>
                                <button onClick={() => handleDelete(loan.id)} style={{padding:'5px 10px', background:'#e74c3c', border:'none', borderRadius:'6px', color:'white', fontWeight:'600', cursor:'pointer', fontSize:'12px'}}>🗑 Delete</button>
                              </>
                            ) : (
                              <button onClick={() => handleArchive(loan.id)} style={{padding:'5px 10px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'6px', color:'rgba(255,255,255,0.7)', fontWeight:'600', cursor:'pointer', fontSize:'12px'}}>🗄 Archive</button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExtending && (
                        <tr>
                          <td colSpan="7" style={{background:'rgba(201,168,76,0.05)', padding:'15px 20px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap'}}>
                              <p style={{color:'rgba(255,255,255,0.7)', margin:0, fontSize:'13px'}}>
                                ⏱ Extend <strong style={{color:'white'}}>{loan.clientName}</strong>'s loan by:
                              </p>
                              <input type="number" placeholder="Number of weeks" value={extensionWeeks} onChange={e => setExtensionWeeks(e.target.value)} min="1" style={{width:'150px', padding:'8px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid #c9a84c', borderRadius:'8px', color:'white', fontSize:'13px'}} />
                              <span style={{color:'rgba(255,255,255,0.5)', fontSize:'13px'}}>weeks</span>
                              {extensionWeeks && parseInt(extensionWeeks) > 0 && (
                                <span style={{color:'rgba(255,255,255,0.5)', fontSize:'13px'}}>
                                  New total: <strong style={{color:'#c9a84c'}}>K{calculateRepayment(loan.amount, weeks + parseInt(extensionWeeks))}</strong>
                                </span>
                              )}
                              <button onClick={() => handleExtend(loan)} style={{padding:'8px 18px', background:'#c9a84c', border:'none', borderRadius:'8px', color:'#1a2634', fontWeight:'700', cursor:'pointer', fontSize:'13px'}}>
                                Confirm Extension
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Loans;