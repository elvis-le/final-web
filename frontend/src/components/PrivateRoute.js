import React from 'react';
import { Navigate } from "react-router-dom";


const getAuthData = () => {
    const token = localStorage.getItem('access_token'); 
    const user = JSON.parse(localStorage.getItem('user')); 
    return {
        isAuthenticated: token !== null,  
        role: user ? user.role : null      
    };
};


const PrivateRoute = ({ children, allowedRoles }) => {
    const authData = getAuthData(); 

    
    if (!authData.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    
    if (!allowedRoles.includes(authData.role)) {
        return <Navigate to="/unauthorized" />;
    }

    
    return children;
};

export default PrivateRoute;
