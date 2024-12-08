import React, {useEffect, useState} from 'react';
import {FaBell, FaEnvelope, FaLock, FaUser} from 'react-icons/fa';
import axios from "axios";
import DeletedProjectsDialog from "../User/DeletedProjectsDialog";
import {FaUnlock} from "react-icons/fa6";
import {Text} from "react-konva";

const Header = () => {
    const [userData, setUserData] = useState([]);
    const token = localStorage.getItem('access_token');
    const [numberUser, setNumberUser] = useState(0);
    const [showNotification, setShowNotification] = useState(false)

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get('http://localhost:8000/myapp/get_all_users/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(response.data);
                setNumberUser(response.data.filter((user) => user.is_new).length);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUserData();
    }, []);

    const handleShowNotification = async () => {
        if (showNotification) {
            setShowNotification(false);
                setUserData((prevData) =>
                    prevData.map((user) =>
                        user.is_new ? {...user, is_new: false} : user
                    )
                );
        } else {
            setShowNotification(true);
            setNumberUser(0);
            const response = await axios.post('http://localhost:8000/myapp/set_new_user/',{}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
            } else {
                console.error('Error set new user');
            }
        }
    };

    return (
        <div className="header">
            <div className="header-left">
            </div>
            <div className="header-right">
                <FaBell className="icon" onClick={handleShowNotification}/>
                <span className="notification-number">{numberUser}</span>
                <FaEnvelope className="icon"/>
                <FaUser className="icon"/>
                {showNotification ?
                    <div className="list-new-user-notification">
                        {userData.map((user) => (
                            user.is_new ? (
                                    <div key={user.id} className="new-user-notification"
                                         style={{backgroundColor: "rgba(200, 255, 255, 0.8)"}}
                                    >{user.username} created an account</div>
                                )
                                :
                                (
                                    <div key={user.id}  className="new-user-notification"
                                    >{user.username} created an account</div>
                                )
                        ))}
                    </div>
                    :
                    <div></div>
                }

            </div>
        </div>
    );
};

export default Header;
