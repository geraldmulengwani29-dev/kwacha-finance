import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', nrc: '', employer: '', employerPhone: '', address: '',
  });

  const fetchClients = async () => {
    const snapshot = await getDocs(collection(db, 'clients'));
    setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'clients'), { ...form, createdAt: new Date(), status: 'active' });
      toast.success('Client added successfully!');
      setForm({ fullName: '', email: '', phone: '', nrc: '', employer: '', employerPhone: '', address: '' });
      setShowForm(false);
      fetchClients();
    } catch (error) { toast.error('Error adding client'); }
    setLoading(false);
  };

  const filteredClients = clients.filter(client => {
    const q = search.toLowerCase();
    return (
      client.fullName?.toLowerCase().includes(q) ||
      client.phone?.toLowerCase().includes(q) ||
      client.nrc?.toLowerCase().includes(q) ||
      client.employer?.toLowerCase().includes(q) ||
      client.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
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

        <div style={{marginBottom:'20px'}}>
          <input
            type="text"
            placeholder="🔍 Search by name, phone, NRC, employer or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'white', fontSize:'14px', boxSizing:'border-box'}}
          />
          {search && (
            <p style={{color:'rgba(255,255,255,0.4)', fontSize:'13px', marginTop:'8px', marginBottom:0}}>
              {filteredClients.length} result{filteredClients.length !== 1 ? 's' : ''} for "{search}"
            </p>
          )}
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Full Name</th><th>Phone</th><th>NRC</th><th>Employer</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>
                  {search ? `No clients found for "${search}"` : 'No clients yet'}
                </td></tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id}>
                    <td>{client.fullName}</td>
                    <td>{client.phone}</td>
                    <td>{client.nrc}</td>
                    <td>{client.employer}</td>
                    <td><span className="badge active">Active</span></td>
                    <td>
                      <button onClick={() => navigate(`/clients/${client.id}`)} style={{padding:'6px 14px', background:'#c9a84c', border:'none', borderRadius:'8px', color:'#1a2634', fontWeight:'600', cursor:'pointer', fontSize:'13px'}}>
                        👤 View Profile
                      </button>
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

export default Clients;