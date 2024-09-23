import logo from './logo.svg';
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss';
import AuthContainer from "./components/AuthContainer";

function App() {
    return (
        <AuthContainer></AuthContainer>
    );
}

export default App;
