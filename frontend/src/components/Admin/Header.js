// Header.js
import React from 'react';
import { FaBell, FaEnvelope, FaUser } from 'react-icons/fa';

const Header = () => {
    return (
        <div className="header">
            <div className="header-left">
            </div>
            <div className="header-right">
                <FaBell className="icon" />
                <FaEnvelope className="icon" />
                <FaUser className="icon" />
            </div>
        </div>
    );
};

export default Header;
