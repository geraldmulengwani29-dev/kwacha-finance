import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    nrc: '',
    employer: '',
    employerPhone: '',
    address: '',
  });

  const fetchClients = async () => {
    const snapshot = await getDocs(collection(db, 'clients'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'clients'), {
        ...form,
        createdAt: new Date(),
        status: 'active'
      });
      toast.success('Client added successfully!');
      setForm({ fullName: '', email: '', phone: '', nrc: '', employer: '', employerPhone: '', address: '' });
      setShowForm(false);
      fetchClients();
    } catch (error) {
      toast.error('Error adding client');
    }
    setLoading(false);
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
          <h1>Clients</h1>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Client'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>New Client</h2>
            <form onSubmit={handleSubmit} className="grid-form">
              <input placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
              <input placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <input placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
              <input placeholder="NRC Number" value={form.nrc} onChange={e => setForm({...form, nrc: e.target.value})} required />
              <input placeholder="Employer" value={form.employer} onChange={e => setForm({...form, employer: e.target.value})} required />
              <input placeholder="Employer Phone" value={form.employerPhone} onChange={e => setForm({...form, employerPhone: e.target.value})} />
              <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="full-width" />
              <button type="submit" className="submit-btn full-width" disabled={loading}>
                {loading ? 'Saving...' : 'Save Client'}
              </button>
            </form>
          </div>
        )}

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Phone</th>
                <th>NRC</th>
                <th>Employer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No clients yet</td></tr>
              ) : (
                clients.map(client => (
                  <tr key={client.id}>
                    <td>{client.fullName}</td>
                    <td>{client.phone}</td>
                    <td>{client.nrc}</td>
                    <td>{client.employer}</td>
                    <td><span className="badge active">Active</span></td>
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

export default Clients;