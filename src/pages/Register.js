import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    nrc: '',
    employer: '',
    employerPhone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      await setDoc(doc(db, 'clients', user.uid), {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        nrc: form.nrc,
        employer: form.employer,
        employerPhone: form.employerPhone,
        address: form.address,
        role: 'client',
        status: 'active',
        createdAt: new Date(),
      });
      toast.success('Account created successfully!');
      navigate('/client-dashboard');
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box" style={{maxWidth:'600px'}}>
        <h1>Kwacha Finance</h1>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="grid-form" style={{textAlign:'left'}}>
          <label htmlFor="fullName" className="sr-only">Full Name</label>
          <input id="fullName" placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'10px', padding:'14px 18px', color:'#fff', fontSize:'15px', outline:'none'}} />

          <label htmlFor="email" className="sr-only">Email Address</label>
          <input id="email" placeholder="Email Address" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'10px', padding:'14px 18px', color:'#fff', fontSize:'15px', outline:'none'}} />

          <label htmlFor="phone" className="sr-only">Phone Number</label>
          <input id="phone" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'10px', padding:'14px 18px', color:'#fff', fontSize:'15px', outline:'none'}} />

          <label htmlFor="nrc" className="sr-only">NRC Number</label>
          <input id="nrc" placeholder="NRC Number" value={form.nrc} onChange={e => setForm({...form, nrc: e.target.value})} required style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'10px', padding:'14px 18px', color:'#fff', fontSize:'15px', outline:'none'}} />

          <label htmlFor="employer" className="sr-only">Employer</label>
          <input id="employer" placeholder="Employer" value={form.employer} onChange={e => setForm({...form, employer: e.target.value})} required style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'10px', padding:'14px 18px', color:'#fff', fontSize:'15px', outline:'none'}} />

          <label htmlFor="employerPhone" className="sr-only">Employer Phone</label>
          <input id="employerPhone" placeholder="Employer Phone" value={form.employerPhone} onChange={e => setForm({...form, employerPhone: e.target.value})} style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'10px', padding:'14px 18px', color:'#fff', fontSize:'15px', outline:'none'}} />

          <label htmlFor="address" className="sr-only">Address</label>
          <input id="address" placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'10px', padding:'14px 18px', color:'#fff', fontSize:'15px', outline:'none', gridColumn:'1 / -1'}} />

          <label htmlFor="password" className="sr-only">Password</label>
          <input id="password" placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'10px', padding:'14px 18px', color:'#fff', fontSize:'15px', outline:'none'}} />

          <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
          <input id="confirmPassword" placeholder="Confirm Password" type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'10px', padding:'14px 18px', color:'#fff', fontSize:'15px', outline:'none'}} />

          <button type="submit" disabled={loading} style={{gridColumn:'1 / -1', background:'linear-gradient(135deg, #c9a84c, #f0c040)', border:'none', borderRadius:'10px', padding:'14px', color:'#1a1a2e', fontSize:'16px', fontWeight:'700', cursor:'pointer'}}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p style={{gridColumn:'1 / -1', textAlign:'center', color:'rgba(255,255,255,0.6)', fontSize:'14px'}}>
            Already have an account?{' '}
            <Link to="/" style={{color:'#c9a84c', textDecoration:'none'}}>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;