import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import "./SetPassword.scss"
import axios from 'axios';

function SetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy uidb64 và token từ URL
    const params = new URLSearchParams(window.location.search);
    const uidb64 = params.get("uidb64");
    const token = params.get("token");
    // Lấy thêm uidb64

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password === confirmPassword){
        try {
            if (uidb64 && token) {
                const response = await axios.post(`http://localhost:8000/myapp/set-password/${uidb64}/${token}/`, {
                    password: password
                });
                if (response.status === 200) {
                    setMessage('Password has been reset successfully!');
                    navigate('/login');
                }
            } else {
                console.error("Missing uidb64 or token");
            }


        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('Failed to reset password. Please try again.');
        }
        }
        else{
        alert('Password does not match!');
            }

    };

    return (
        <div className="set-password-page">
        <div className="content-wrapper">
            <h2>Set Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Set Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
}

export default SetPassword;
