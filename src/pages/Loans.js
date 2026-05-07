import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Loans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientId: '',
    amount: '',
    interestRate: 10,
    collateral: '',
    notes: '',
  });

  const fetchData = async () => {
    const loansSnap = await getDocs(collection(db, 'loans'));
    const clientsSnap = await getDocs(collection(db, 'clients'));
    setLoans(loansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setClients(clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateRepayment = (amount, weeks) => {
    let total = parseFloat(amount);
    for (let i = 0; i < weeks; i++) {
      total += total * 0.10;
    }
    return total.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const client = clients.find(c => c.id === form.clientId);
    try {
      await addDoc(collection(db, 'loans'), {
        ...form,
        clientName: client.fullName,
        amount: parseFloat(form.amount),
        interestRate: 10,
        status: 'active',
        startDate: new Date(),
        weeksPassed: 0,
        totalOwed: parseFloat(form.amount),
      });
      toast.success('Loan created successfully!');
      setForm({ clientId: '', amount: '', interestRate: 10, collateral: '', notes: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error('Error creating loan');
    }
    setLoading(false);
  };

  const getWeeksPassed = (startDate) => {
    if (!startDate) return 0;
    const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
    const now = new Date();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7));
    return diff;
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
          <h1>Loans</h1>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Loan'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>New Loan</h2>
            <form onSubmit={handleSubmit} className="grid-form">
              <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})} required>
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.fullName}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Loan Amount (K)"
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                required
              />
              <input
                placeholder="Collateral (or type 'None')"
                value={form.collateral}
                onChange={e => setForm({...form, collateral: e.target.value})}
                required
              />
              <input
                placeholder="Interest Rate (%)"
                value="10% per week"
                disabled
              />
              <textarea
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                className="full-width"
                rows="3"
                style={{resize:'none'}}
              />
              <button type="submit" className="submit-btn full-width" disabled={loading}>
                {loading ? 'Saving...' : 'Create Loan'}
              </button>
            </form>
          </div>
        )}

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Amount (K)</th>
                <th>Collateral</th>
                <th>Weeks</th>
                <th>Total Owed (K)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No loans yet</td></tr>
              ) : (
                loans.map(loan => {
                  const weeks = getWeeksPassed(loan.startDate);
                  const totalOwed = calculateRepayment(loan.amount, weeks);
                  return (
                    <tr key={loan.id}>
                      <td>{loan.clientName}</td>
                      <td>K{loan.amount}</td>
                      <td>{loan.collateral}</td>
                      <td>{weeks}</td>
                      <td>K{totalOwed}</td>
                      <td><span className={`badge ${loan.status}`}>{loan.status}</span></td>
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

export default Loans;