import React, {useEffect, useState} from 'react';
import "./Register.scss"
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {FaGoogle} from "react-icons/fa";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const Register = ({onRegister, onSwitch}) => {
    const [confirmPassword, setConfirmPassword] = useState("")
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== confirmPassword) {
            setDialogMessage('Password does not match!');
            setDialogOpen(true);
        } else {

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

                    navigate('/login');
                } else {
                    console.error(response.data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        let page = "register"
        const response = await axios.get("http://localhost:8000/myapp/auth/google/init/", {
            params: { page },
        });
        window.location.href = response.data.url;
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            axios
                .get(`http://localhost:8000/myapp/auth/google/callback/?code=${code}`)
                .then(response => {
                    if (response.data.access) {
                        localStorage.setItem("access_token", response.data.access);
                        localStorage.setItem("refresh_token", response.data.refresh);
                        localStorage.setItem("user", JSON.stringify(response.data.user));
                        navigate("/user");
                    } else {
                        console.log(response.data.message);
                    }
                })
                .catch(error => {
                    console.error("Error during Google authentication:", error);
                });
        }
    }, [navigate]);


    const HandleChangeSite = () => {
        navigate("/login")
    }


    return (
        <div className="register-container">
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                className="custom-dialog"
            >
                <DialogTitle>
                    Notification
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>OK</Button>
                </DialogActions>
            </Dialog>
            <div className="form-box">
                <div className="logo">Edit Video</div>
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
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                    <div className="login-option-icon" onClick={handleGoogleSignIn}><FaGoogle/></div>
                    <p>Already A Member? <span className="switch-link" onClick={HandleChangeSite}>Log In</span></p>
                    <button type="submit" className="submit-btn">Create account</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
