import React, { useState } from 'react';
import "./Register.scss"

const Register = ({ onRegister, onSwitch }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

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
        const response = await fetch('http://localhost:8000/myapp/register_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (result.success) {
            console.log('User registered successfully');
        } else {
            console.error(result.error);
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
