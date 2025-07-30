import React, {useEffect, useState} from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';
import {useNavigate} from 'react-router-dom';
import './Admin.scss';
import axios from "axios";

const AdminLayout = () => {
    const [selectedOption, setSelectedOption] = useState('users');
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem("refresh_token");

    useEffect(() => {
        const savedOption = localStorage.getItem('selectedOption');
        if (savedOption) {
            setSelectedOption(savedOption);
        }
    }, []);

    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                await axios.get("http://localhost:8000/myapp/validate_token/", {
                    headers: {Authorization: `Bearer ${token}`},
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        const response = await axios.post("http://localhost:8000/myapp/token/refresh/", {
                            refresh: refreshToken,
                        });
                        localStorage.setItem("access_token", response.data.access);
                    } catch (refreshError) {
                        navigate("/login");
                    }
                } else {
                    navigate("/login");
                }
            }
        };
        checkTokenValidity();
    }, [navigate]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        localStorage.setItem('selectedOption', option);
    };

    return (
        <div className="admin-layout">
            <Sidebar onOptionSelect={handleOptionSelect}/>
            <div className="main-container">
                <Header/>
                <MainContent selectedOption={selectedOption}/>

            </div>
        </div>
    );
};

export default AdminLayout;
