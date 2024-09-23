import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import User from "./components/User/User";
import Admin from "./components/Admin/Admin";
import Login from "./components/Login";
import HomePage from "./components/Home/HomePage";
import Register from "./components/Register";
import AudioManage from "./components/Admin/AudioManage";
import TextManage from "./components/Admin/TextManage";
import StickerManage from "./components/Admin/StickerManage";
import EffectManage from "./components/Admin/EffectManage";
import FilterManage from "./components/Admin/FilterManage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="register" element={<Register/>}/>
            <Route path="home" element={<HomePage/>}/>
            <Route path="user" element={<User/>}/>
            <Route path="admin/*" element={<Admin/>}>
                <Route path="AudioManage" element={<AudioManage/>}/>
                <Route path="TextManage" element={<TextManage/>}/>
                <Route path="StickerManage" element={<StickerManage/>}/>
                <Route path="EffectManage" element={<EffectManage/>}/>
                <Route path="FilterManage" element={<FilterManage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>,
);

// const home = ReactDOM.createRoot(document.getElementById('home'));
// root.render(<Home />);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
