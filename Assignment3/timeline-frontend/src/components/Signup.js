import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isExisting, setIsExisting] = useState(false); // هل الخطأ بسبب email موجود؟

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsExisting(false);
    try {
      const res = await axios.post('http://localhost:5000/user/signup', {
        firstName, lastName, email, password
      });

      if (res.data.success) {
        navigate("/login");
      } else {
        setMessage(res.data.error || 'Error signing up');
        if (res.data.error === 'Email already exists') {
          setIsExisting(true);
        }
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Server error';
      setMessage(errMsg);
      if (errMsg === 'Email already exists') {
        setIsExisting(true);
      }
    }
  };

  return (
    <div className="signlog_container">
      <div className="signup">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Sign Up</button>
        </form>

        {message && (
          <p style={{ color: 'red', marginTop: '10px', fontSize: '13px', textAlign: 'center' }}>
            {message}
            {isExisting && (
              <> — <Link to="/login" style={{ color: '#4f46e5', fontWeight: '600' }}>Login instead?</Link></>
            )}
          </p>
        )}

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
