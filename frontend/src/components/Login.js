import React, { useEffect, useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle } from "react-icons/fa";

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
      const response = await axios.post('http://localhost:8000/myapp/login_user/', { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = response.data;
      console.log('Login successful:', data);

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.redirect_url === '/admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage(error.response?.data?.error || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get("http://localhost:8000/myapp/auth/google/login/init/");
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        setErrorMessage("Failed to initialize Google login.");
      }
    } catch (error) {
      console.error("Error initializing Google login:", error);
      setErrorMessage("Error initializing Google login.");
    }
  };

  const HandleChangeSite = () => {
    navigate("/register")
  }


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const accessToken = urlParams.get('access');
    const refreshToken = urlParams.get('refresh');

    
    const user = urlParams.get('user');
    const redirectUrl = urlParams.get('redirect_url');

    console.log("Access Token from URL:", accessToken);
    console.log("Refresh Token from URL:", refreshToken);

    if (accessToken && refreshToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        if (user) {
            try {
                
                const decodedUser = JSON.parse(decodeURIComponent(user));
                localStorage.setItem('user', JSON.stringify(decodedUser));
                console.log("User Info:", decodedUser);
            } catch (error) {
                console.error("Failed to parse user JSON:", error);
                
                localStorage.removeItem('user');
            }
        }

        if (redirectUrl) {
            localStorage.setItem('redirect_url', redirectUrl);
            console.log("Redirect URL:", redirectUrl);
        }

        navigate(redirectUrl || '/user');
    } else {
        console.log("Tokens not found in URL or invalid.");
        navigate("/login");
    }
}, [navigate]);


  return (
    <div className="login-container">
      <div className="form-box">
        <div className="logo">Edit Video</div>
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
          <div className="login-option-icon" onClick={handleGoogleLogin}><FaGoogle /></div>
          <p>New Here? <span className="switch-link" onClick={HandleChangeSite}>Create an account</span></p>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
