import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import logo from '../KWACHA.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
    } catch (error) {
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <img
            src={logo}
            alt="Kwacha Finance"
            style={{ width: '150px', height: 'auto' }}
          />
        </div>
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email" className="sr-only">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{marginTop:'15px', color:'rgba(255,255,255,0.6)', fontSize:'14px'}}>
          Don't have an account?{' '}
          <Link to="/register" style={{color:'#c9a84c', textDecoration:'none'}}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;