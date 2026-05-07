import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loans, setLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    loanId: '',
    amount: '',
    notes: '',
  });

  const fetchData = async () => {
    const paymentsSnap = await getDocs(collection(db, 'payments'));
    const loansSnap = await getDocs(collection(db, 'loans'));
    setPayments(paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoans(loansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loan = loans.find(l => l.id === form.loanId);
    try {
      await addDoc(collection(db, 'payments'), {
        loanId: form.loanId,
        clientName: loan.clientName,
        amount: parseFloat(form.amount),
        notes: form.notes,
        date: new Date(),
      });
      toast.success('Payment recorded successfully!');
      setForm({ loanId: '', amount: '', notes: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error('Error recording payment');
    }
    setLoading(false);
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
                  <option key={loan.id} value={loan.id}>
                    {loan.clientName} - K{loan.amount}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount Paid (K)"
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                required
              />
              <input
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                className="full-width"
              />
              <button type="submit" className="submit-btn full-width" disabled={loading}>
                {loading ? 'Saving...' : 'Record Payment'}
              </button>
            </form>
          </div>
        )}

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Amount Paid (K)</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No payments yet</td></tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.clientName}</td>
                    <td>K{payment.amount}</td>
                    <td>{formatDate(payment.date)}</td>
                    <td>{payment.notes || '-'}</td>
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

export default Payments;