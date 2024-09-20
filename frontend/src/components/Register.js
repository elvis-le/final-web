import React, { useState } from 'react';
import "./Register.scss"
import {useNavigate} from "react-router-dom";
import axios from 'axios';

const Register = ({ onRegister, onSwitch }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:8000/myapp/register_user/', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      console.log('User registered successfully');

      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/user');
    } else {
      console.error(response.data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  return (
      <div className="register-container">
        <div className="form-box">
          <div className="logo">Anywhere app.</div>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
              <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  required
              />
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

            <p>Already A Member? <span className="switch-link" onClick={onSwitch}>Log In</span></p>
            <button type="submit" className="submit-btn">Create account</button>
          </form>
        </div>
      </div>
  );
};

export default Register;
