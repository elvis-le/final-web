import React, {useState} from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';
import './Admin.scss';

const AdminLayout = () => {
    const [selectedOption, setSelectedOption] = useState('users');

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="admin-layout">
            <Sidebar onOptionSelect={handleOptionSelect} />
            <div className="main-container">
                <Header />
                <MainContent selectedOption={selectedOption} />
            </div>
        </div>
    );
};

export default AdminLayout;
