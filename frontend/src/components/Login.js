import React, { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = ({ onLogin, onSwitch }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  const { email, password } = formData;

  if (!email || !password) {
    setErrorMessage('Please enter your email and password');
    return;
  }

  setLoading(true);
  setErrorMessage(null);

  try {
    const response = await axios.post('http://localhost:8000/myapp/login_user/',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const data = response.data;
    console.log('Login successful:', data);

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));

    navigate('/user');
  } catch (error) {
    console.error('Error during login:', error);
    setErrorMessage(error.response?.data?.error || 'Login error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="form-box">
        <div className="logo">Anywhere app.</div>
        <h2>Log In</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />
          <p>New Here? <span className="switch-link" onClick={onSwitch}>Create an account</span></p>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
