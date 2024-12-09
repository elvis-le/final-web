import logo from './logo.svg';
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss';
import Login from "./components/Login";

function App() {
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000/ws/admin/");

        socket.onopen = () => {
            console.log("WebSocket connected!");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Message from server:", data.message);
            alert(`Notification: ${data.message}`);
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected.");
        };

        return () => socket.close();
    }, []);
    return (
        <Login></Login>
    );
}

export default App;
