import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import { escapeHTML } from '../utils/security';

const ClientProfile = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const printRef = useRef();
  const [client, setClient] = useState(null);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const getWeeksPassed = (startDate) => {
    if (!startDate) return 0;
    const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
    return Math.floor((new Date() - start) / (1000 * 60 * 60 * 24 * 7));
  };

  const calculateTotalOwed = (loan) => {
    const principal = parseFloat(loan.amount);
    const weeks = getWeeksPassed(loan.startDate);
    return principal + (principal * 0.10 * weeks);
  };

  const getTotalPaid = (loanId) => {
    return payments.filter(p => p.loanId === loanId).reduce((sum, p) => sum + parseFloat(p.amount), 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  const fetchData = async () => {
    const clientDoc = await getDoc(doc(db, 'clients', clientId));
    if (clientDoc.exists()) {
      const data = { id: clientDoc.id, ...clientDoc.data() };
      setClient(data);
      setEditForm({ fullName: data.fullName || '', phone: data.phone || '', nrc: data.nrc || '', employer: data.employer || '', employerPhone: data.employerPhone || '', address: data.address || '' });
    }
    const loansSnap = await getDocs(query(collection(db, 'loans'), where('clientEmail', '==', clientDoc.data().email)));
    setLoans(loansSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    const paymentsSnap = await getDocs(query(collection(db, 'payments'), where('clientEmail', '==', clientDoc.data().email)));
    setPayments(paymentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    const appsSnap = await getDocs(query(collection(db, 'applications'), where('clientEmail', '==', clientDoc.data().email)));
    setApplications(appsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchData(); }, [clientId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'clients', clientId), editForm);
      toast.success('Client details updated!');
      setEditing(false);
      fetchData();
    } catch (error) { toast.error('Error updating client'); }
    setSaving(false);
  };

  const handlePrint = () => {
    const totalBorrowed = loans.reduce((sum, l) => sum + parseFloat(l.amount), 0);
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const loansRows = loans.map(loan => {
      const weeks = getWeeksPassed(loan.startDate);
      const totalOwed = calculateTotalOwed(loan);
      const paid = getTotalPaid(loan.id);
      const remaining = Math.max(0, totalOwed - paid);
      // Escape dynamic values to prevent XSS in manual HTML construction
      return `<tr><td>K${escapeHTML(loan.amount)}</td><td>${escapeHTML(loan.collateral)}</td><td>${escapeHTML(weeks)}</td><td>K${totalOwed.toFixed(2)}</td><td style="color:#27ae60">K${paid.toFixed(2)}</td><td style="color:${remaining > 0 ? '#e74c3c' : '#27ae60'}">${remaining > 0 ? `K${remaining.toFixed(2)}` : '✔ Cleared'}</td><td>${escapeHTML(loan.status)}</td></tr>`;
    }).join('');
    const paymentsRows = payments.map(p => `<tr><td style="color:#27ae60">K${escapeHTML(p.amount)}</td><td>${escapeHTML(formatDate(p.date))}</td><td>${escapeHTML(p.notes || '-')}</td></tr>`).join('');
    const appsRows = applications.map(app => `<tr><td>K${escapeHTML(app.requestedAmount)}</td><td>${escapeHTML(app.collateral)}</td><td>${escapeHTML(app.status)}</td><td>${app.offeredAmount ? `K${escapeHTML(app.offeredAmount)}` : '-'}</td><td>${escapeHTML(formatDate(app.createdAt))}</td></tr>`).join('');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Kwacha Finance — ${escapeHTML(client.fullName)}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #1a2634; }
        h1 { color: #1a2634; border-bottom: 2px solid #c9a84c; padding-bottom: 10px; margin-bottom: 5px; }
        h2 { color: #1a2634; margin-top: 30px; margin-bottom: 10px; font-size: 16px; }
        .meta { color: #666; font-size: 13px; margin-bottom: 25px; }
        .details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; border: 1px solid #eee; border-radius: 8px; padding: 20px; }
        .detail-item label { font-size: 11px; color: #999; display: block; margin-bottom: 3px; }
        .detail-item p { font-size: 14px; font-weight: 600; margin: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
        .stat-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; }
        .stat-card h3 { font-size: 12px; color: #666; margin: 0 0 6px 0; }
        .stat-card p { font-size: 20px; font-weight: 700; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 5px; margin-bottom: 25px; }
        th { background: #1a2634; color: white; padding: 9px 10px; text-align: left; font-size: 12px; }
        td { padding: 9px 10px; border-bottom: 1px solid #eee; font-size: 12px; }
        tr:nth-child(even) { background: #f9f9f9; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 11px; border-top: 1px solid #eee; padding-top: 15px; }
      </style></head>
      <body>
        <h1>Client Profile — ${escapeHTML(client.fullName)}</h1>
        <p class="meta">Generated on ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })} &bull; Kwacha Finance</p>
        <h2>Personal Details</h2>
        <div class="details-grid">
          <div class="detail-item"><label>Email</label><p>${escapeHTML(client.email)}</p></div>
          <div class="detail-item"><label>Phone</label><p>${escapeHTML(client.phone)}</p></div>
          <div class="detail-item"><label>NRC</label><p>${escapeHTML(client.nrc)}</p></div>
          <div class="detail-item"><label>Employer</label><p>${escapeHTML(client.employer)}</p></div>
          <div class="detail-item"><label>Employer Phone</label><p>${escapeHTML(client.employerPhone || '-')}</p></div>
          <div class="detail-item"><label>Address</label><p>${escapeHTML(client.address || '-')}</p></div>
          <div class="detail-item"><label>Member Since</label><p>${escapeHTML(formatDate(client.createdAt))}</p></div>
        </div>
        <div class="stats-grid">
          <div class="stat-card"><h3>Total Borrowed</h3><p style="color:#c9a84c">K${totalBorrowed.toLocaleString()}</p></div>
          <div class="stat-card"><h3>Total Paid</h3><p style="color:#27ae60">K${totalPaid.toLocaleString()}</p></div>
          <div class="stat-card"><h3>Active Loans</h3><p style="color:#c9a84c">${loans.filter(l => l.status === 'active').length}</p></div>
          <div class="stat-card"><h3>Completed Loans</h3><p style="color:#27ae60">${loans.filter(l => l.status === 'completed').length}</p></div>
        </div>
        <h2>Loans</h2>
        <table><thead><tr><th>Amount (K)</th><th>Collateral</th><th>Weeks</th><th>Total Owed (K)</th><th>Total Paid (K)</th><th>Remaining (K)</th><th>Status</th></tr></thead>
        <tbody>${loansRows || '<tr><td colspan="7" style="text-align:center;color:#999">No loans</td></tr>'}</tbody></table>
        <h2>Payment History</h2>
        <table><thead><tr><th>Amount Paid (K)</th><th>Date</th><th>Notes</th></tr></thead>
        <tbody>${paymentsRows || '<tr><td colspan="3" style="text-align:center;color:#999">No payments yet</td></tr>'}</tbody></table>
        <h2>Applications</h2>
        <table><thead><tr><th>Requested (K)</th><th>Collateral</th><th>Status</th><th>Offered (K)</th><th>Date</th></tr></thead>
        <tbody>${appsRows || '<tr><td colspan="5" style="text-align:center;color:#999">No applications</td></tr>'}</tbody></table>
        <div class="footer">Kwacha Finance &bull; kwachafinance.web.app &bull; Confidential</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  if (!client) return <div style={{color:'white', display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Loading...</div>;

  const totalBorrowed = loans.reduce((sum, l) => sum + parseFloat(l.amount), 0);
  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const activeLoans = loans.filter(l => l.status === 'active');
  const completedLoans = loans.filter(l => l.status === 'completed');

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <h1>👤 {client.fullName}</h1>
          <div style={{display:'flex', gap:'10px'}}>
            <button onClick={() => navigate('/clients')} style={{padding:'10px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white', cursor:'pointer'}}>
              ← Back to Clients
            </button>
            <button onClick={handlePrint} style={{padding:'10px 18px', background:'#c9a84c', border:'none', borderRadius:'8px', color:'#1a2634', fontWeight:'700', cursor:'pointer'}}>
              🖨️ Export PDF
            </button>
            <button onClick={() => setEditing(!editing)} style={{padding:'10px 18px', background: editing ? 'rgba(231,76,60,0.2)' : 'rgba(201,168,76,0.15)', border:`1px solid ${editing ? '#e74c3c' : '#c9a84c'}`, borderRadius:'8px', color: editing ? '#e74c3c' : '#c9a84c', fontWeight:'600', cursor:'pointer'}}>
              {editing ? '✕ Cancel Edit' : '✏️ Edit Details'}
            </button>
          </div>
        </div>

        <div className="form-card" style={{marginBottom:'30px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
            <h2 style={{margin:0}}>Personal Details</h2>
            {editing && (
              <button onClick={handleSave} disabled={saving} style={{padding:'8px 20px', background:'#27ae60', border:'none', borderRadius:'8px', color:'white', fontWeight:'600', cursor:'pointer'}}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            )}
          </div>
          {editing ? (
            <div className="grid-form">
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>Full Name</p><input value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} style={{width:'100%', padding:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white'}} /></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>Phone</p><input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} style={{width:'100%', padding:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white'}} /></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>NRC</p><input value={editForm.nrc} onChange={e => setEditForm({...editForm, nrc: e.target.value})} style={{width:'100%', padding:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white'}} /></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>Employer</p><input value={editForm.employer} onChange={e => setEditForm({...editForm, employer: e.target.value})} style={{width:'100%', padding:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white'}} /></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>Employer Phone</p><input value={editForm.employerPhone} onChange={e => setEditForm({...editForm, employerPhone: e.target.value})} style={{width:'100%', padding:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white'}} /></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>Address</p><input value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} style={{width:'100%', padding:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white'}} /></div>
            </div>
          ) : (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'20px', marginTop:'15px'}}>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>Email</p><p style={{color:'white', margin:0}}>{client.email}</p></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>Phone</p><p style={{color:'white', margin:0}}>{client.phone}</p></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>NRC</p><p style={{color:'white', margin:0}}>{client.nrc}</p></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>Employer</p><p style={{color:'white', margin:0}}>{client.employer}</p></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>Employer Phone</p><p style={{color:'white', margin:0}}>{client.employerPhone || '-'}</p></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>Address</p><p style={{color:'white', margin:0}}>{client.address || '-'}</p></div>
              <div><p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>Member Since</p><p style={{color:'white', margin:0}}>{formatDate(client.createdAt)}</p></div>
            </div>
          )}
        </div>

        <div className="stats-grid" style={{marginBottom:'30px'}}>
          <div className="stat-card"><h3>Total Borrowed</h3><p style={{color:'#c9a84c'}}>K{totalBorrowed.toLocaleString()}</p></div>
          <div className="stat-card"><h3>Total Paid</h3><p style={{color:'#27ae60'}}>K{totalPaid.toLocaleString()}</p></div>
          <div className="stat-card"><h3>Active Loans</h3><p style={{color:'#c9a84c'}}>{activeLoans.length}</p></div>
          <div className="stat-card"><h3>Completed Loans</h3><p style={{color:'#27ae60'}}>{completedLoans.length}</p></div>
        </div>

        <h2 style={{color:'white', marginBottom:'15px'}}>Loans</h2>
        <div className="table-card" style={{marginBottom:'30px'}}>
          <table className="data-table">
            <thead><tr><th>Amount (K)</th><th>Collateral</th><th>Weeks</th><th>Total Owed (K)</th><th>Total Paid (K)</th><th>Remaining (K)</th><th>Status</th></tr></thead>
            <tbody>
              {loans.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No loans</td></tr>
              ) : (
                loans.map(loan => {
                  const weeks = getWeeksPassed(loan.startDate);
                  const totalOwed = calculateTotalOwed(loan);
                  const paid = getTotalPaid(loan.id);
                  const remaining = Math.max(0, totalOwed - paid);
                  return (
                    <tr key={loan.id}>
                      <td>K{loan.amount}</td><td>{loan.collateral}</td><td>{weeks}</td>
                      <td>K{totalOwed.toFixed(2)}</td>
                      <td style={{color:'#27ae60'}}>K{paid.toFixed(2)}</td>
                      <td style={{color: remaining > 0 ? '#e74c3c' : '#27ae60'}}>{remaining > 0 ? `K${remaining.toFixed(2)}` : '✔ Cleared'}</td>
                      <td><span className={`badge ${loan.status}`}>{loan.status}</span></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <h2 style={{color:'white', marginBottom:'15px'}}>Payment History</h2>
        <div className="table-card" style={{marginBottom:'30px'}}>
          <table className="data-table">
            <thead><tr><th>Amount Paid (K)</th><th>Date</th><th>Notes</th></tr></thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="3" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No payments yet</td></tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment.id}>
                    <td style={{color:'#27ae60'}}>K{payment.amount}</td>
                    <td>{formatDate(payment.date)}</td>
                    <td>{payment.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h2 style={{color:'white', marginBottom:'15px'}}>Applications</h2>
        <div className="table-card">
          <table className="data-table">
            <thead><tr><th>Requested (K)</th><th>Collateral</th><th>Status</th><th>Offered (K)</th><th>Date</th></tr></thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No applications</td></tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id}>
                    <td>K{app.requestedAmount}</td><td>{app.collateral}</td>
                    <td><span className={`badge ${app.status}`}>{app.status}</span></td>
                    <td>{app.offeredAmount ? `K${app.offeredAmount}` : '-'}</td>
                    <td>{formatDate(app.createdAt)}</td>
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

export default ClientProfile;