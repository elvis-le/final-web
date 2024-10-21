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
import DeletedProjectsDialog from "./components/User/DeletedProjectsDialog";
import Admin from "./components/Admin/Admin";
import Login from "./components/Login";
import HomePage from "./components/Home/HomePage";
import Register from "./components/Register";
import MainContent from "./components/Admin/MainContent";
import UserManage from "./components/Admin/UserManage";
import AudioManage from "./components/Admin/AudioManage";
import AudioCreate from "./components/Admin/AudioCreate";
import AudioEdit from "./components/Admin/AudioEdit";
import TextManage from "./components/Admin/TextManage";
import TextCreate from "./components/Admin/TextCreate";
import TextEdit from "./components/Admin/TextEdit";
import StickerManage from "./components/Admin/StickerManage";
import StickerCreate from "./components/Admin/StickerCreate";
import StickerEdit from "./components/Admin/StickerEdit";
import EffectManage from "./components/Admin/EffectManage";
import EffectCreate from "./components/Admin/EffectCreate";
import EffectEdit from "./components/Admin/EffectEdit";
import FilterManage from "./components/Admin/FilterManage";
import FilterCreate from "./components/Admin/FilterCreate";
import FilterEdit from "./components/Admin/FilterEdit";
import Profile from "./components/Admin/Profile";
import PrivateRoute from './components/PrivateRoute'; // Import component kiểm tra đăng nhập

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="register" element={<Register/>}/>

            
            <Route path="home" element={
                    <HomePage />
            }/>

            <Route path="user" element={
                <PrivateRoute allowedRoles={['user']}>
                    <User />
                </PrivateRoute>
            }>
                <Route path="DeletedProjectsDialog" element={<DeletedProjectsDialog/>}/>
            </Route>

            <Route path="admin/*" element={
                <PrivateRoute allowedRoles={['admin']}>
                    <Admin />
                </PrivateRoute>
            }>
                <Route path="UserManage" element={<UserManage/>}/>
                <Route path="Profile" element={<Profile/>}/>
                <Route path="AudioManage" element={<AudioManage/>}/>
                <Route path="AudioCreate" element={<AudioCreate/>}/>
                <Route path="AudioEdit" element={<AudioEdit/>}/>
                <Route path=":type/edit/:id" element={<MainContent />} />
                <Route path="TextManage" element={<TextManage/>}/>
                <Route path="TextCreate" element={<TextCreate/>}/>
                <Route path="TextEdit" element={<TextEdit/>}/>
                <Route path="StickerManage" element={<StickerManage/>}/>
                <Route path="StickerCreate" element={<StickerCreate/>}/>
                <Route path="StickerEdit" element={<StickerEdit/>}/>
                <Route path="EffectManage" element={<EffectManage/>}/>
                <Route path="EffectCreate" element={<EffectCreate/>}/>
                <Route path="EffectEdit" element={<EffectEdit/>}/>
                <Route path="FilterManage" element={<FilterManage/>}/>
                <Route path="FilterCreate" element={<FilterCreate/>}/>
                <Route path="FilterEdit" element={<FilterEdit/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
);

reportWebVitals();
