import React, {useState} from 'react';
import {FaChartBar, FaUsers, FaVideo, FaMusic, FaFont, FaStickerMule, FaMagic, FaFilter, FaUser} from 'react-icons/fa';
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";

const Sidebar = ({onOptionSelect}) => {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [imageUrl, setImageUrl] = useState(user.image || '');
    const [name, setName] = useState(user.username || '');


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
                {refresh_token: refreshToken},
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
                <Link className="sidebar-user" to="/admin/profile" onClick={() => onOptionSelect('profile')}>
                <img src={imageUrl} alt="Admin Avatar"/>
                <h3>{name}</h3>
                <span className="status-online">Online</span>

                </Link>
            <ul className="sidebar-menu">
                <li><Link className="link-sider" to="/admin/profile" onClick={() => onOptionSelect('profile')}><FaUser className="link-icon" />
                    <span className="link-text" >Profile</span></Link></li>
                <li><Link className="link-sider" to="/admin/users" onClick={() => onOptionSelect('users')}><FaUsers className="link-icon"/>
                    <span className="link-text" >Users</span></Link></li>
                <li><Link className="link-sider" to="/admin/audio" onClick={() => onOptionSelect('audio')}><FaMusic className="link-icon"/>
                    <span className="link-text" >Audio</span></Link></li>
                <li><Link className="link-sider" to="/admin/text" onClick={() => onOptionSelect('text')}><FaFont className="link-icon"/>
                    <span className="link-text" >Text</span></Link></li>
                <li><Link className="link-sider" to="/admin/sticker" onClick={() => onOptionSelect('sticker')}><FaStickerMule className="link-icon"/>
                    <span className="link-text" >Stickers</span></Link></li>
                <li><Link className="link-sider" to="/admin/effect" onClick={() => onOptionSelect('effect')}><FaMagic className="link-icon"/>
                    <span className="link-text" >Effects</span></Link></li>
                <li><Link className="link-sider" to="/admin/filter" onClick={() => onOptionSelect('filter')}><FaFilter className="link-icon"/>
                    <span className="link-text" >Filters</span></Link></li>
                <button onClick={handleLogout} className="logout-btn">
                    <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1"
                         viewBox="0 0 1024 1024">
                        <path
                            d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
                    </svg>
                    <span>Log out</span>
                </button>
            </ul>
        </div>
    );
};

export default Sidebar;
