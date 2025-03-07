import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', { Email, Password })
      .then((res) => {
        console.log(res);
        if (res.data === 'Success') {
        // Redirect to a dashboard page after successful login
            navigate('/dashboard');
        }
        else {
            alert('Login failed. Please check your credentials and try again.');
        }
      })
      .catch((err) => {
        console.log(err);
        // Handle login error
        alert('Login failed. Please check your credentials and try again.');
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <Link to="/register">Don't have an account? Sign up</Link>
      </form>
    </div>
  );
}

export default Login;