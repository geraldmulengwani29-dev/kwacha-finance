import React, { useState } from 'react';
import { auth } from '../firebase';
import { updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminProfile = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const reauth = async () => {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!currentPassword) return toast.error('Enter your current password to confirm');
    setLoadingEmail(true);
    try {
      await reauth();
      await updateEmail(user, newEmail);
      toast.success('Email updated successfully!');
      setNewEmail('');
      setCurrentPassword('');
    } catch (error) {
      toast.error(error.code === 'auth/wrong-password' ? 'Current password is incorrect' : error.message);
    }
    setLoadingEmail(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (!currentPassword) return toast.error('Enter your current password to confirm');
    setLoadingPassword(true);
    try {
      await reauth();
      await updatePassword(user, newPassword);
      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error) {
      toast.error(error.code === 'auth/wrong-password' ? 'Current password is incorrect' : error.message);
    }
    setLoadingPassword(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <h1>⚙️ Admin Profile</h1>
          <button onClick={() => navigate('/dashboard')} style={{padding:'10px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white', cursor:'pointer'}}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="form-card" style={{marginBottom:'30px'}}>
          <h2>Account Info</h2>
          <div style={{marginTop:'15px'}}>
            <p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0}}>Logged in as</p>
            <p style={{color:'white', fontWeight:'600', fontSize:'16px', margin:'5px 0 0'}}>{user?.email}</p>
          </div>
        </div>

        <div className="form-card" style={{marginBottom:'30px'}}>
          <h2>Update Email</h2>
          <form onSubmit={handleUpdateEmail} className="grid-form" style={{marginTop:'15px'}}>
            <div className="full-width">
              <p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>New Email Address</p>
              <input type="email" placeholder="Enter new email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required style={{width:'100%', padding:'11px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white', boxSizing:'border-box'}} />
            </div>
            <div className="full-width">
              <p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>Current Password (to confirm)</p>
              <input type="password" placeholder="Enter current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required style={{width:'100%', padding:'11px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white', boxSizing:'border-box'}} />
            </div>
            <button type="submit" className="submit-btn full-width" disabled={loadingEmail}>{loadingEmail ? 'Updating...' : 'Update Email'}</button>
          </form>
        </div>

        <div className="form-card">
          <h2>Change Password</h2>
          <form onSubmit={handleUpdatePassword} className="grid-form" style={{marginTop:'15px'}}>
            <div className="full-width">
              <p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>Current Password</p>
              <input type="password" placeholder="Enter current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required style={{width:'100%', padding:'11px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white', boxSizing:'border-box'}} />
            </div>
            <div>
              <p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>New Password</p>
              <input type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{width:'100%', padding:'11px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white', boxSizing:'border-box'}} />
            </div>
            <div>
              <p style={{color:'rgba(255,255,255,0.5)', fontSize:'12px', marginBottom:'5px'}}>Confirm New Password</p>
              <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{width:'100%', padding:'11px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'white', boxSizing:'border-box'}} />
            </div>
            <button type="submit" className="submit-btn full-width" disabled={loadingPassword}>{loadingPassword ? 'Updating...' : 'Change Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;