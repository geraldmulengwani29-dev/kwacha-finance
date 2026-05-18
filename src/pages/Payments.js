import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loans, setLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ loanId: '', amount: '', notes: '' });

  const fetchData = async () => {
    const paymentsSnap = await getDocs(collection(db, 'payments'));
    const loansSnap = await getDocs(collection(db, 'loans'));
    setPayments(paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoans(loansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchData(); }, []);

  const getWeeksPassed = (startDate) => {
    if (!startDate) return 0;
    const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
    return Math.floor((new Date() - start) / (1000 * 60 * 60 * 24 * 7));
  };

  const getTotalOwed = (loan) => {
    const principal = parseFloat(loan.amount);
    const weeks = getWeeksPassed(loan.startDate);
    return principal + (principal * 0.10 * weeks);
  };

  const getTotalPaid = (loanId) => {
    return payments.filter(p => p.loanId === loanId).reduce((sum, p) => sum + parseFloat(p.amount), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loan = loans.find(l => l.id === form.loanId);
    const totalPaidSoFar = getTotalPaid(form.loanId);
    const totalOwed = getTotalOwed(loan);
    const newTotalPaid = totalPaidSoFar + parseFloat(form.amount);
    try {
      await addDoc(collection(db, 'payments'), {
        loanId: form.loanId, clientName: loan.clientName, clientEmail: loan.clientEmail,
        amount: parseFloat(form.amount), notes: form.notes, date: new Date(),
      });
      if (newTotalPaid >= totalOwed) {
        await updateDoc(doc(db, 'loans', form.loanId), { status: 'completed', paidAt: new Date() });
        toast.success('Payment recorded — loan fully paid and closed!');
      } else {
        toast.success('Payment recorded successfully!');
      }
      setForm({ loanId: '', amount: '', notes: '' });
      setShowForm(false);
      fetchData();
    } catch (error) { toast.error('Error recording payment'); }
    setLoading(false);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  const loansWithPayments = loans.filter(loan => payments.some(p => p.loanId === loan.id));

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <h1>Payments</h1>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Record Payment'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>Record Payment</h2>
            <form onSubmit={handleSubmit} className="grid-form">
              <select value={form.loanId} onChange={e => setForm({...form, loanId: e.target.value})} required>
                <option value="">Select Loan</option>
                {loans.filter(l => l.status === 'active').map(loan => (
                  <option key={loan.id} value={loan.id}>{loan.clientName} - K{loan.amount}</option>
                ))}
              </select>
              <input type="number" placeholder="Amount Paid (K)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
              <input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="full-width" />
              {form.loanId && (() => {
                const loan = loans.find(l => l.id === form.loanId);
                if (!loan) return null;
                const totalOwed = getTotalOwed(loan);
                const totalPaid = getTotalPaid(form.loanId);
                const remaining = totalOwed - totalPaid;
                return (
                  <div className="full-width" style={{background:'rgba(255,255,255,0.05)', borderRadius:'10px', padding:'15px'}}>
                    <div style={{display:'flex', gap:'30px', flexWrap:'wrap'}}>
                      <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>Total Owed</p><p style={{color:'#c9a84c', fontWeight:'700', margin:0}}>K{totalOwed.toFixed(2)}</p></div>
                      <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>Total Paid</p><p style={{color:'#27ae60', fontWeight:'700', margin:0}}>K{totalPaid.toFixed(2)}</p></div>
                      <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>Remaining</p><p style={{color:'#e74c3c', fontWeight:'700', margin:0}}>K{remaining.toFixed(2)}</p></div>
                    </div>
                  </div>
                );
              })()}
              <button type="submit" className="submit-btn full-width" disabled={loading}>{loading ? 'Saving...' : 'Record Payment'}</button>
            </form>
          </div>
        )}

        {loansWithPayments.length > 0 && (
          <div style={{marginBottom:'30px'}}>
            <h2 style={{color:'white', marginBottom:'15px'}}>Loan Summaries</h2>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'15px'}}>
              {loansWithPayments.map(loan => {
                const totalOwed = getTotalOwed(loan);
                const totalPaid = getTotalPaid(loan.id);
                const remaining = totalOwed - totalPaid;
                const progress = Math.min((totalPaid / totalOwed) * 100, 100);
                return (
                  <div key={loan.id} className="stat-card" style={{textAlign:'left', padding:'20px'}}>
                    <p style={{color:'white', fontWeight:'700', marginBottom:'5px'}}>{loan.clientName}</p>
                    <p style={{color:'rgba(255,255,255,0.5)', fontSize:'13px', marginBottom:'15px'}}>K{loan.amount} loan — {loan.status}</p>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                      <span style={{color:'rgba(255,255,255,0.5)', fontSize:'12px'}}>Progress</span>
                      <span style={{color:'#c9a84c', fontSize:'12px'}}>{progress.toFixed(0)}%</span>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.1)', borderRadius:'4px', height:'6px', marginBottom:'15px'}}>
                      <div style={{background:'#27ae60', width:`${progress}%`, height:'100%', borderRadius:'4px'}} />
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                      <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'11px', margin:0}}>Paid</p><p style={{color:'#27ae60', fontWeight:'700', margin:0}}>K{totalPaid.toFixed(2)}</p></div>
                      <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'11px', margin:0}}>Remaining</p><p style={{color: remaining <= 0 ? '#27ae60' : '#e74c3c', fontWeight:'700', margin:0}}>{remaining <= 0 ? 'Fully Paid' : `K${remaining.toFixed(2)}`}</p></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr><th>Client</th><th>Loan (K)</th><th>Amount Paid (K)</th><th>Date</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No payments yet</td></tr>
              ) : (
                payments.map(payment => {
                  const loan = loans.find(l => l.id === payment.loanId);
                  return (
                    <tr key={payment.id}>
                      <td>{payment.clientName}</td>
                      <td>{loan ? `K${loan.amount}` : '-'}</td>
                      <td>K{payment.amount}</td>
                      <td>{formatDate(payment.date)}</td>
                      <td>{payment.notes || '-'}</td>
                    </tr>
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

export default Payments;