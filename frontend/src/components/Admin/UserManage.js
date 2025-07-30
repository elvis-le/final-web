import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {FiPlusCircle, FiEdit, FiTrash2} from "react-icons/fi";
import {FaLock} from "react-icons/fa";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {FaUnlock} from "react-icons/fa6";

const UserManage = ({onOptionSelect}) => {
    const [userData, setUserData] = useState([]);
    const token = localStorage.getItem('access_token');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get('http://localhost:8000/myapp/get_all_users/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUserData();
    }, []);

    const handleLock = async (userId) => {
    confirmAlert({
        title: 'Confirm to lock',
        message: 'Are you sure you want to lock this user?',
        buttons: [
            {
                label: 'Yes',
                onClick: async () => {
                    try {
                        const response = await axios.post(`http://localhost:8000/myapp/lock_user/`, {
                            userId: userId,
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        if (response.status === 200) {
                            setUserData((prevData) =>
                                prevData.map((user) =>
                                    user.id === userId ? { ...user, is_valid: false } : user
                                )
                            );
                            setDialogMessage('User locked successfully!');
                            setDialogOpen(true);
                        } else {
                            setDialogMessage('Failed to lock user.');
                            setDialogOpen(true);
                        }
                    } catch (error) {
                        console.error('Error locking user:', error);
                        setDialogMessage('An error occurred while locking the user.');
                        setDialogOpen(true);
                    }
                }
            },
            {
                label: 'No',
                onClick: () => console.log('Lock canceled')
            }
        ]
    });
};

    const handleUnLock = async (userId) => {
    confirmAlert({
        title: 'Confirm to unlock',
        message: 'Are you sure you want to unlock this user?',
        buttons: [
            {
                label: 'Yes',
                onClick: async () => {
                    try {
                        const response = await axios.post(`http://localhost:8000/myapp/unlock_user/`, {
                            userId: userId,
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        if (response.status === 200) {
                            setUserData((prevData) =>
                                prevData.map((user) =>
                                    user.id === userId ? { ...user, is_valid: true } : user
                                )
                            );
                            setDialogMessage('User unlocked successfully!');
                            setDialogOpen(true);
                        } else {
                            setDialogMessage('Failed to unlock user.');
                            setDialogOpen(true);
                        }
                    } catch (error) {
                        console.error('Error unlocking user:', error);
                        setDialogMessage('An error occurred while unlocking the user.');
                        setDialogOpen(true);
                    }
                }
            },
            {
                label: 'No',
                onClick: () => console.log('Unlock canceled')
            }
        ]
    });
};


    return (
        <>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                className="custom-dialog"
            >
                <DialogTitle>
                    Notification
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>OK</Button>
                </DialogActions>
            </Dialog>
            <h1 className="content-heading">User manage</h1>
            <table className="table-user-wrap table-display-data-wrap">
                <thead className="table-user-head table-display-data-head">
                <tr className="table-user-head-row table-display-data-head-row">
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "10%"}}>Image</th>
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "10%"}}>Username
                    </th>
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "15%"}}>Fullname
                    </th>
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "10%"}}>Email</th>
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "10%"}}>Sex</th>
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "10%"}}>Birthday
                    </th>
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "15%"}}>Address
                    </th>
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "20%"}}>Action</th>
                </tr>
                </thead>
                <tbody className="table-user-wrap-body table-display-data-wrap-body">
                {userData.map((user) => (
                    <tr key={user.id} className="table-user-body-row table-display-data-body-row">
                        <td className="table-user-body-cell table-display-data-body-cell"
                            style={{width: "10%", textAlign: "center"}}><img src={user.image}/></td>
                        <td className="table-user-body-cell table-display-data-body-cell"
                            style={{width: "15%"}}>{user.username}</td>
                        <td className="table-user-body-cell table-display-data-body-cell"
                            style={{width: "15%"}}>{user.fullname}</td>
                        <td className="table-user-body-cell table-display-data-body-cell"
                            style={{width: "10%"}}>{user.email}</td>
                        <td className="table-user-body-cell table-display-data-body-cell"
                            style={{width: "10%", textAlign: "center"}}>{user.sex}</td>
                        <td className="table-user-body-cell table-display-data-body-cell" style={{
                            width: "10%",
                            textAlign: "center"
                        }}>{new Date(user.birth_date).toLocaleString()}</td>
                        <td className="table-user-body-cell table-display-data-body-cell"
                            style={{width: "10%", textAlign: "center"}}>{user.address}</td>
                        <td className="table-user-body-cell table-display-data-body-cell" style={{width: "20%"}}>
                            <div className="action-btn-wrap">
                                {
                                    user.is_valid ?
                                        <button className="pushable delete-btn" onClick={() => handleLock(user.id)}>
                                            <span className="shadow"></span>
                                            <span className="edge"></span>
                                            <span className="front"><FaLock className="icon"/> Lock </span>
                                        </button>
                                        :
                                        <button className="pushable delete-btn" onClick={() => handleUnLock(user.id)}>
                                            <span className="shadow"></span>
                                            <span className="edge"></span>
                                            <span className="front"><FaUnlock className="icon"/> Unlock </span>
                                        </button>
                                }

                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default UserManage;
