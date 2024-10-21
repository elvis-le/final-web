import React from 'react';
import {FaChartBar, FaUsers, FaVideo, FaMusic, FaFont, FaStickerMule, FaMagic, FaFilter, FaUser} from 'react-icons/fa';
import axios from "axios";
import {useNavigate, Link } from "react-router-dom";

const Sidebar = ({ onOptionSelect }) => {

  const navigate = useNavigate();
    const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    if (!refreshToken || !accessToken) {
      console.error("Can not find refresh token or access token");
      return;
    }

    const response = await axios.post('http://localhost:8000/myapp/logout_user/',
      { refresh_token: refreshToken },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      console.log("Logout successful");
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    } else {
      console.error("Logout error:", response.data);
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};
    return (
        <div className="sidebar">
            <div className="sidebar-user">
                <img src="" alt="Admin Avatar" />
                <h3>John David</h3>
                <span className="status-online">Online</span>
            </div>
            <ul className="sidebar-menu">
                <li><Link className="link" to="/admin/profile" onClick={() => onOptionSelect('profile')}><FaUser/>
                    <span>Profile</span></Link></li>
                <li><Link className="link" to="/admin/users" onClick={() => onOptionSelect('users')}><FaUsers/>
                    <span>Users</span></Link></li>
                <li><Link className="link" to="/admin/audio" onClick={() => onOptionSelect('audio')}><FaMusic/>
                    <span>Audio</span></Link></li>
                <li><Link className="link" to="/admin/text" onClick={() => onOptionSelect('text')}><FaFont/>
                    <span>Text</span></Link></li>
                <li><Link className="link" to="/admin/sticker"
                          onClick={() => onOptionSelect('sticker')}><FaStickerMule/> <span>Stickers</span></Link></li>
                <li><Link className="link" to="/admin/effect" onClick={() => onOptionSelect('effect')}><FaMagic/>
                    <span>Effects</span></Link></li>
                <li><Link className="link" to="/admin/filter" onClick={() => onOptionSelect('filter')}><FaFilter/>
                    <span>Filters</span></Link></li>
                <button onClick={handleLogout} className="logout-btn">
                    Log out
                </button>
            </ul>
        </div>
    );
};

export default Sidebar;
