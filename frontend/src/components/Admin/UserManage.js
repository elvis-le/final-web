import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {FiPlusCircle, FiEdit, FiTrash2} from "react-icons/fi";

const UserManage = ({onOptionSelect}) => {
    const [userData, setUserData] = useState([]);
    const token = localStorage.getItem('access_token');

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

    const handleDelete = async (userId) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this user?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axios.post(`http://localhost:8000/myapp/delete_user/`, {
                                userId: userId,                              }, {
                                headers: {
                                    Authorization: `Bearer ${token}`,                                  },
                            });
                            if (response.status === 201) {
                                setUserData(userData.filter(user => user.id !== userId));
                                alert('File đã được xoá thành công!');
                            } else {
                                alert('Không thể xoá file');
                            }
                        } catch (error) {
                            console.error('Error deleting user:', error);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => console.log('Delete canceled')
                }
            ]
        });
    };

    return (
        <>
            <h1 className="content-heading">User manage</h1>
            <button className="create-new active-btn"><Link className="link link-create" to="/admin/user/create-user" onClick={() => onOptionSelect('createUser')}><FiPlusCircle className="icon"/>
                <span>New</span></Link></button>
            <table className="table-user-wrap table-display-data-wrap">
                <thead className="table-user-head table-display-data-head">
                <tr className="table-user-head-row table-display-data-head-row">
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "10%"}}>Image</th>
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "10%"}}>Username</th>
                    <th className="table-user-head-cell table-display-data-head-cell" style={{width: "15%"}}>Fullname</th>
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
                        <td className="table-user-body-cell table-display-data-body-cell" style={{width: "10%", textAlign: "center"}}><img src={user.image}/></td>
                        <td className="table-user-body-cell table-display-data-body-cell" style={{width: "15%"}}>{user.username}</td>
                        <td className="table-user-body-cell table-display-data-body-cell" style={{width: "15%"}}>{user.fullname}</td>
                        <td className="table-user-body-cell table-display-data-body-cell" style={{width: "10%"}}>{user.email}</td>
                        <td className="table-user-body-cell table-display-data-body-cell" style={{width: "10%", textAlign: "center"}}>{user.sex}</td>
                        <td className="table-user-body-cell table-display-data-body-cell" style={{width: "10%", textAlign: "center"}}>{new Date(user.birth_date).toLocaleString()}</td>
                        <td className="table-user-body-cell table-display-data-body-cell" style={{width: "10%", textAlign: "center"}}>{user.address}</td>
                        <td className="table-user-body-cell table-display-data-body-cell" style={{width: "20%"}}>
                            <div className="action-btn-wrap">
                                <button className="pushable delete-btn" onClick={() => handleDelete(user.id)}>
                                    <span className="shadow"></span>
                                    <span className="edge"></span>
                                    <span className="front"><FiTrash2 className="icon"/> Delete </span>
                                </button>
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
