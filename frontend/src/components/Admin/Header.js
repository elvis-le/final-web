import React, {useEffect, useState} from 'react';
import {FaBell, FaEnvelope, FaLock, FaUser} from 'react-icons/fa';
import axios from "axios";
import DeletedProjectsDialog from "../User/DeletedProjectsDialog";
import {FaUnlock} from "react-icons/fa6";
import {Text} from "react-konva";
import {IoMdClose, IoMdSend} from "react-icons/io";
import {v4 as uuidv4} from "uuid";

const Header = () => {
    const [userData, setUserData] = useState([]);
    const [numberUser, setNumberUser] = useState(0);
    const [showNotification, setShowNotification] = useState(false);
    const [showListMessage, setShowListMessage] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [messageContents, setMessageContents] = useState([]);
    const [messageContent, setMessageContent] = useState("");
    const [userId, setUserId] = useState("");

    const token = localStorage.getItem('access_token');

    const fetchUserData = async () => {
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
    };


    const fetchMessage = async (userId) => {
        if (!token) {
            console.error("Token does not exist");
            return;
        }
        console.log("Token was sent:", token);
        console.log("User ID:", userId);
        console.log(typeof userId);

        try {
            const response = await axios.get(`http://localhost:8000/myapp/get_message_user/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Response from get_message_user:", response.data);
            if (Array.isArray(response.data) && response.data.length > 0) {
                const messages = response.data[0].content || [];
                setMessageContents(messages);
            } else {
                console.error("Content is not found in the response.");
            }
        } catch (error) {
            if (error.response) {
                console.error(`Error: ${error.response.status} - ${error.response.statusText}`);
                console.error("Error details:", error.response.data);
            } else {
                console.error("Error fetching message:", error.message);
            }
        }
    }


    useEffect(() => {
        fetchUserData();
        const ws = new WebSocket('ws://localhost:8000/ws/admin/');

        ws.onopen = () => {
            console.log('WebSocket connected!');
        };

        ws.onmessage = (event) => {
            console.log('Received WebSocket message:', event.data);
            fetchUserData();
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected. Reconnecting...');
            setTimeout(() => {
                const ws = new WebSocket('ws://localhost:8000/ws/admin/');
            }, 1000);
        };

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/admin/');
    console.log(userId);  

    ws.onopen = () => {
        console.log('WebSocket connected!');
    };

    ws.onmessage = (event) => {
        console.log('Received WebSocket message:', event.data);
        if (userId) {  
            fetchMessage(userId); 
        }
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected. Reconnecting...');
        setTimeout(() => {
            const ws = new WebSocket('ws://localhost:8000/ws/admin/');
        }, 1000);
    };

    return () => {
        ws.close();
    };
}, [userId]);  



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
            const response = await axios.post('http://localhost:8000/myapp/set_new_user/', {}, {
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

    const handleShowListMessage = async (userId) => {
        if (showNotification) {
            setShowListMessage(false);
        } else {
            setUserId(userId);
        setMessageContents([])
    fetchMessage(userId);
    setShowListMessage(true);
        }
    };

    const handleSentMessage = async (e) => {
    e.preventDefault();

    const now = new Date();
    const sentTime = now.toLocaleTimeString();

    const newMessage = {
        id: uuidv4(),
        content: messageContent,
        role: "admin",
        sentTime: sentTime,
    };

    const updatedMessageContents = [...messageContents, newMessage];

    try {
        const response = await axios.post(`http://localhost:8000/myapp/update_message/${userId}/`, {
            messageContents: updatedMessageContents,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            fetchMessage(userId);
            setMessageContent("");
        } else {
            console.error('Error sending message:', response.statusText);
        }
    } catch (error) {
        console.error('Error when sending message:', error.message);
    }
};

    const handleMessageClick = () => {
        setShowMessage(true);
    };

    useEffect(() => {
    if (userId) {
        fetchMessage(userId);
    }
}, [userId]);

    return (
        <div className="header">
            <div className="header-left">
            </div>
            <div className="header-right">
                <FaBell className="icon" onClick={handleShowNotification}/>
                <span className="notification-number new-account-notification">{numberUser}</span>
                <FaEnvelope className="icon" onClick={handleShowListMessage}/>
                <span className="notification-number new-message-notification">{numberUser}</span>
                <FaUser className="icon"/>
                {showListMessage ?
                    <div className="list-user-list-message">
                        {userData.map((user) => (
                            <button
                                key={user.id}
                                className="user-list-message"
                                onClick={() =>
                                {handleShowListMessage(user.id);
                                    handleMessageClick();}}
                            >
                                {user.username}
                            </button>
                        ))}
                    </div>


                    :
                    <div></div>
                }
                {showMessage ? (<div className="message-box">
                    <div className="message-bar">
                        <span>Message</span>
                        <button className="close-mess-btn" onClick={() => {
                            setShowMessage(false)
                        }}><IoMdClose/></button>
                    </div>
                    <div className="message-content-wrap">
                        {Array.isArray(messageContents) && messageContents.map((message) => {
                            if (message.role === "admin") {
                                return (
                                    <div className="message-content-sent" key={message.id}>
                                        <span>{message.content}</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="message-content-receive" key={message.id}>
                                        <span>{message.content}</span>
                                    </div>
                                );
                            }
                        })}
                    </div>
                    <div className="message-text-wrap">
                        <input type="text" className="message-content" name="message-content"
                               value={messageContent}
                               onChange={(e) => setMessageContent(e.target.value.toLowerCase())}/>
                        <button className="sent-message-content" onClick={(e) => handleSentMessage(e)}><IoMdSend/>
                        </button>
                    </div>
                </div>) : (<></>)}
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
                                    <div key={user.id} className="new-user-notification"
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
