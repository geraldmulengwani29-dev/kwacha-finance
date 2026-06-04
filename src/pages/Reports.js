import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { escapeHTML } from '../utils/security';

const Reports = () => {
  const navigate = useNavigate();
  const printRef = useRef();
  const [data, setData] = useState({
    totalDisbursed: 0, totalCollected: 0, totalOutstanding: 0,
    totalClients: 0, activeLoans: 0, completedLoans: 0, overdueLoans: 0,
  });
  const [clientBreakdown, setClientBreakdown] = useState([]);

  const getWeeksPassed = (startDate) => {
    if (!startDate) return 0;
    const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
    return Math.floor((new Date() - start) / (1000 * 60 * 60 * 24 * 7));
  };

  const fetchData = async () => {
    const loansSnap = await getDocs(collection(db, 'loans'));
    const paymentsSnap = await getDocs(collection(db, 'payments'));
    const clientsSnap = await getDocs(collection(db, 'clients'));
    const loans = loansSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const payments = paymentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const totalDisbursed = loans.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
    const totalCollected = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const activeLoans = loans.filter(l => l.status === 'active');
    const completedLoans = loans.filter(l => l.status === 'completed');
    const totalOutstanding = activeLoans.reduce((sum, loan) => {
      const weeks = getWeeksPassed(loan.startDate);
      const principal = parseFloat(loan.amount);
      const owed = principal + (principal * 0.10 * weeks);
      const paid = payments.filter(p => p.loanId === loan.id).reduce((s, p) => s + parseFloat(p.amount), 0);
      return sum + Math.max(0, owed - paid);
    }, 0);
    const overdueLoans = activeLoans.filter(loan => {
      const weeks = getWeeksPassed(loan.startDate);
      if (weeks < 1) return false;
      const principal = parseFloat(loan.amount);
      const owed = principal + (principal * 0.10 * weeks);
      const paid = payments.filter(p => p.loanId === loan.id).reduce((s, p) => s + parseFloat(p.amount), 0);
      return paid < owed;
    });
    const clientMap = {};
    loans.forEach(loan => {
      const email = loan.clientEmail || loan.clientName;
      if (!clientMap[email]) clientMap[email] = { name: loan.clientName, totalBorrowed: 0, totalPaid: 0, totalOwed: 0, loans: 0 };
      const weeks = getWeeksPassed(loan.startDate);
      const principal = parseFloat(loan.amount);
      const owed = loan.status === 'active' ? principal + (principal * 0.10 * weeks) : principal;
      const paid = payments.filter(p => p.loanId === loan.id).reduce((s, p) => s + parseFloat(p.amount), 0);
      clientMap[email].totalBorrowed += principal;
      clientMap[email].totalPaid += paid;
      clientMap[email].totalOwed += loan.status === 'active' ? Math.max(0, owed - paid) : 0;
      clientMap[email].loans += 1;
    });
    setClientBreakdown(Object.values(clientMap));
    setData({ totalDisbursed, totalCollected, totalOutstanding, totalClients: clientsSnap.size, activeLoans: activeLoans.length, completedLoans: completedLoans.length, overdueLoans: overdueLoans.length });
  };

  useEffect(() => { fetchData(); }, []);

  const handlePrint = () => {
    const collectionRate = data.totalDisbursed > 0 ? ((data.totalCollected / data.totalDisbursed) * 100).toFixed(1) : 0;
    const clientRows = clientBreakdown.map(client => `
      <tr>
        <td style="font-weight:600">${escapeHTML(client.name)}</td>
        <td>${client.loans}</td>
        <td>K${client.totalBorrowed.toFixed(2)}</td>
        <td style="color:#27ae60">K${client.totalPaid.toFixed(2)}</td>
        <td style="color: ${client.totalOwed > 0 ? '#e74c3c' : '#27ae60'}">${client.totalOwed > 0 ? `K${client.totalOwed.toFixed(2)}` : '✔ Cleared'}</td>
      </tr>
    `).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Kwacha Finance — Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #1a2634; }
        h1 { color: #1a2634; border-bottom: 2px solid #c9a84c; padding-bottom: 10px; }
        h2 { color: #1a2634; margin-top: 30px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
        .stat-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; }
        .stat-card h3 { font-size: 13px; color: #666; margin: 0 0 8px 0; }
        .stat-card p { font-size: 22px; font-weight: 700; margin: 0; color: #1a2634; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #1a2634; color: white; padding: 10px; text-align: left; font-size: 13px; }
        td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
        tr:nth-child(even) { background: #f9f9f9; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px; }
      </style></head>
      <body>
        <h1>Kwacha Finance — Financial Report</h1>
        <p style="color:#666; margin-top:-5px;">Generated on ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</p>

        <div class="stats-grid" style="margin-bottom:30px">
          <div class="stat-card"><h3>Total Disbursed</h3><p style="color:#c9a84c">K${data.totalDisbursed.toLocaleString()}</p></div>
          <div class="stat-card"><h3>Total Collected</h3><p style="color:#27ae60">K${data.totalCollected.toLocaleString()}</p></div>
          <div class="stat-card"><h3>Outstanding Balance</h3><p style="color:#e74c3c">K${data.totalOutstanding.toFixed(2)}</p></div>
          <div class="stat-card"><h3>Total Clients</h3><p>${data.totalClients}</p></div>
        </div>
        <div class="stats-grid" style="margin-bottom:30px">
          <div class="stat-card"><h3>Active Loans</h3><p style="color:#c9a84c">${data.activeLoans}</p></div>
          <div class="stat-card"><h3>Completed Loans</h3><p style="color:#27ae60">${data.completedLoans}</p></div>
          <div class="stat-card"><h3>Overdue Loans</h3><p style="color: ${data.overdueLoans > 0 ? '#e74c3c' : '#27ae60'}">${data.overdueLoans}</p></div>
          <div class="stat-card"><h3>Collection Rate</h3><p style="color:#c9a84c">${collectionRate}%</p></div>
        </div>

        <h2>Client Breakdown</h2>
        <table>
          <thead>
            <tr><th>Client</th><th>Total Loans</th><th>Total Borrowed (K)</th><th>Total Paid (K)</th><th>Outstanding (K)</th></tr>
          </thead>
          <tbody>
            ${clientRows || '<tr><td colspan="5" style="text-align:center;padding:20px;color:#999">No data yet</td></tr>'}
          </tbody>
        </table>

        <div class="footer">Kwacha Finance &bull; kwachafinance.web.app &bull; Confidential</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const collectionRate = data.totalDisbursed > 0 ? ((data.totalCollected / data.totalDisbursed) * 100).toFixed(1) : 0;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <h1>Reports</h1>
          <button onClick={handlePrint} style={{padding:'10px 20px', background:'#c9a84c', border:'none', borderRadius:'8px', color:'#1a2634', fontWeight:'700', cursor:'pointer', fontSize:'14px'}}>
            🖨️ Export PDF
          </button>
        </div>
        <div ref={printRef}>
          <div className="stats-grid" style={{marginBottom:'30px'}}>
            <div className="stat-card"><h3>Total Disbursed</h3><p style={{color:'#c9a84c'}}>K{data.totalDisbursed.toLocaleString()}</p></div>
            <div className="stat-card"><h3>Total Collected</h3><p style={{color:'#27ae60'}}>K{data.totalCollected.toLocaleString()}</p></div>
            <div className="stat-card"><h3>Outstanding Balance</h3><p style={{color:'#e74c3c'}}>K{data.totalOutstanding.toFixed(2)}</p></div>
            <div className="stat-card"><h3>Total Clients</h3><p>{data.totalClients}</p></div>
          </div>
          <div className="stats-grid" style={{marginBottom:'30px'}}>
            <div className="stat-card"><h3>Active Loans</h3><p style={{color:'#c9a84c'}}>{data.activeLoans}</p></div>
            <div className="stat-card"><h3>Completed Loans</h3><p style={{color:'#27ae60'}}>{data.completedLoans}</p></div>
            <div className="stat-card"><h3>Overdue Loans</h3><p style={{color: data.overdueLoans > 0 ? '#e74c3c' : '#27ae60'}}>{data.overdueLoans}</p></div>
            <div className="stat-card"><h3>Collection Rate</h3><p style={{color:'#c9a84c'}}>{collectionRate}%</p></div>
          </div>
          <h2 style={{color:'white', marginBottom:'15px'}}>Client Breakdown</h2>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr><th>Client</th><th>Total Loans</th><th>Total Borrowed (K)</th><th>Total Paid (K)</th><th>Outstanding (K)</th></tr>
              </thead>
              <tbody>
                {clientBreakdown.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign:'center', padding:'30px', color:'rgba(255,255,255,0.4)'}}>No data yet</td></tr>
                ) : (
                  clientBreakdown.map((client, i) => (
                    <tr key={i}>
                      <td style={{fontWeight:'600'}}>{client.name}</td>
                      <td>{client.loans}</td>
                      <td>K{client.totalBorrowed.toFixed(2)}</td>
                      <td style={{color:'#27ae60'}}>K{client.totalPaid.toFixed(2)}</td>
                      <td style={{color: client.totalOwed > 0 ? '#e74c3c' : '#27ae60'}}>{client.totalOwed > 0 ? `K${client.totalOwed.toFixed(2)}` : '✔ Cleared'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;