import React, { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';


const Login = ({ onLogin, onSwitch }) => {
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
        const response = await fetch('http://localhost:8000/myapp/login_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            }),
        });

        const result = await response.json();
        if (result.success) {
            console.log('Logged in successfully');
            navigate('/home');
        } else {
            console.error(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


  return (
      <div className="login-container">
        <div className="form-box">
          <div className="logo">Anywhere app.</div>
          <h2>Log In</h2>
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
            <button type="submit" className="submit-btn">Log In</button>
          </form>
        </div>
      </div>
  );
};
export default Login;
