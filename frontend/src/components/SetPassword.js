import React, {useState} from 'react';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
import "./SetPassword.scss"
import axios from 'axios';

function SetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const { uidb64, token } = useParams();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password === confirmPassword){
        try {
            console.log(`URL: http://localhost:8000/myapp/set-password/${uidb64}/${token}/`);
            console.log("Password:", password);
            console.log("uidb64:", uidb64);
            console.log("token:", token);
            console.log("Confirm Password:", confirmPassword);

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
