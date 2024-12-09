import React, {useState, useEffect} from "react";
import './User.scss';
import {useNavigate} from "react-router-dom";
import imgTest from '../../assets/images/Nitro_Wallpaper_01_3840x2400.jpg';
import {GoTrash} from "react-icons/go";
import axios from 'axios';
import DeletedProjectsDialog from './DeletedProjectsDialog';
import {confirmAlert} from "react-confirm-alert";
import {v4 as uuidv4} from "uuid";
import {supabase} from "../../supabaseClient";
import {
    TextField,
    Button,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    InputAdornment,
    IconButton,
    DialogActions,
    DialogContentText
} from '@mui/material';
import {FaEye, FaEyeSlash, FaUser} from "react-icons/fa";
import {MdOutlineDashboard, MdOutlineRestore, MdOutlineRestorePage} from "react-icons/md";
import {CiLogout} from "react-icons/ci";
import {IoMdClose, IoMdSend} from "react-icons/io";

const User = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const [isProfile, setIsProfile] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [image, setImage] = useState('');
    const [userId, setUserId] = useState(user.id || '');
    const [imageUrl, setImageUrl] = useState(user.image || '');
    const [name, setName] = useState(user.username || '');
    const [fullName, setFullName] = useState(user.fullname || '');
    const [email, setEmail] = useState(user.email || '');
    const [sex, setSex] = useState(user.sex || '');
    const [birthday, setBirthday] = useState(user.birth_date || '');
    const [address, setAddress] = useState(user.address || '');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [messageContents, setMessageContents] = useState([]);
    const [messageContent, setMessageContent] = useState("");
    const [deletedProjects, setDeletedProjects] = useState([]);


    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                await axios.get("http://localhost:8000/myapp/validate_token/", {
                    headers: {Authorization: `Bearer ${token}`},
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        const response = await axios.post("http://localhost:8000/myapp/token/refresh/", {
                            refresh: refreshToken,
                        });
                        localStorage.setItem("access_token", response.data.access);
                    } catch (refreshError) {
                        navigate("/login");
                    }
                } else {
                    navigate("/login");
                }
            }
        };

        checkTokenValidity();
    }, [token, refreshToken]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/admin/');

        ws.onopen = () => {
            console.log('WebSocket connected!');
        };

        ws.onmessage = (event) => {
            console.log('Received WebSocket message:', event.data);
            fetchMessage();
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

    const fetchDeletedProjects = async () => {
        if (!token) {
            console.error("Token does not exist");
            return;
        }

        console.log("Token was send:", token);

        try {
            const response = await axios.get('http://localhost:8000/myapp/get_user_deleted_projects/', {
                headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json',
                },
            });

            setDeletedProjects(response.data.projects);
        } catch (error) {
            if (error.response) {
                console.error(`Error: ${error.response.status} - ${error.response.statusText}`);
                console.error("Error details:", error.response.data);
            } else {
                console.error("Error fetching projects:", error.message);
            }
        }
    };

    const fetchProjects = async () => {
        if (!token) {
            console.error("Token does not exist");
            return;
        }

        console.log("Token was send:", token);

        try {
            const response = await axios.get('http://localhost:8000/myapp/get_user_projects/', {
                headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json',
                },
            });

            setProjects(response.data.projects);
        } catch (error) {
            if (error.response) {
                console.error(`Error: ${error.response.status} - ${error.response.statusText}`);
                console.error("Error details:", error.response.data);
            } else {
                console.error("Error fetching projects:", error.message);
            }
        }
    };

    const fetchMessage = async () => {
        if (!token) {
            console.error("Token does not exist");
            return;
        }

        console.log("Token was sent:", token);
        console.log("User ID:", user.id);
        console.log(typeof user.id);

        try {
            const response = await axios.get(`http://localhost:8000/myapp/get_message_user/${user.id}/`, {
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
        fetchProjects();
        fetchMessage();
        fetchDeletedProjects();
    }, []);

    const filteredProjects = projects.filter(project => project.name.toLowerCase().includes(searchKeyword));

    const handleTogglePasswordVisibility = (setShowPassword, showPassword) => {
        setShowPassword(!showPassword);
    };

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            const accessToken = localStorage.getItem('access_token');

            if (!refreshToken || !accessToken) {
                console.error("Can not find refresh token or access token");
                return;
            }

            const response = await axios.post('http://localhost:8000/myapp/logout_user/', {refresh_token: refreshToken}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json'
                }
            });

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

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value.toLowerCase());
    };

    const handleRestoreProject = async (projectId) => {
        confirmAlert({
            title: 'Confirm to restore', message: 'Are you sure you want to restore this project?', buttons: [{
                label: 'Yes', onClick: async () => {
                    try {
                        const response = await axios.post(`http://localhost:8000/myapp/restore_project/`, {
                            projectId: projectId,
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        if (response.status === 200) {
                            setDeletedProjects(deletedProjects.filter(project => project.id !== projectId));
                            fetchProjects();
                            setDialogMessage('File is restore successfully!');
                            setDialogOpen(true);
                        } else {

                            setDialogMessage('Can not restore');
                            setDialogOpen(true);
                        }
                    } catch (error) {
                        console.error('Error restore project:', error);
                    }
                }
            }, {
                label: 'No', onClick: () => console.log('Restore canceled')
            }]
        });
    };

    const handleRestoreAllProject = async () => {
        confirmAlert({
            title: 'Confirm to restore all project',
            message: 'Are you sure you want to restore all project?',
            buttons: [{
                label: 'Yes', onClick: async () => {
                    try {
                        const response = await axios.post(`http://localhost:8000/myapp/restore_all_project/`, {}, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        if (response.status === 200) {
                            setDeletedProjects([])
                            fetchProjects();
                            setDialogMessage('Restore successfully!');
                            setDialogOpen(true);
                        } else {

                            setDialogMessage('Can not restore');
                            setDialogOpen(true);
                        }
                    } catch (error) {
                        console.error('Error restore project:', error);
                    }
                }
            }, {
                label: 'No', onClick: () => console.log('Restore canceled')
            }]
        });
    }

    const handleDeleteAllProject = async () => {
        confirmAlert({
            title: 'Confirm to delete all project', message: 'Are you sure you want to delete all project?', buttons: [{
                label: 'Yes', onClick: async () => {
                    try {
                        const response = await axios.post(`http://localhost:8000/myapp/delete_all_project/`, {}, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        if (response.status === 200) {
                            fetchProjects();
                            setDialogMessage('Delete successfully!');
                            setDialogOpen(true);
                        } else {
                            setDialogMessage('Can not delete');
                            setDialogOpen(true);
                        }
                    } catch (error) {
                        console.error('Error delete project:', error);
                    }
                }
            }, {
                label: 'No', onClick: () => console.log('Delete canceled')
            }]
        });
    }

    const createProject = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('http://localhost:8000/myapp/create_project/', {project_name: new Date().toISOString().slice(0, 10)}, {
                headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json',
                }
            });

            console.log("Project created successfully:", response.data.project);
            const projectId = response.data.project.id;
            localStorage.setItem('current_project_id', projectId);

            navigate('/home');
        } catch (error) {
            console.error("Error creating project:", error.response?.data || error.message);
        }
    };

    const handleSelectProject = (projectId) => {
        localStorage.setItem('current_project_id', projectId);
        navigate('/home');
    };

    const handleTrashClick = () => {
        setIsDialogOpen(true);
    };

    const handleMessageClick = () => {
        setShowMessage(!showMessage);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const [contextMenu, setContextMenu] = useState(null);

    const handleRightClick = (event, projectId) => {
        event.preventDefault();
        setContextMenu({
            projectId, x: event.clientX, y: event.clientY
        });
    };

    const handleClickOutside = () => {
        setContextMenu(null);
    };

    const handleOpenProject = (projectId) => {
        localStorage.setItem('current_project_id', projectId);
        navigate('/home');
    }

    const handleDeleteProject = async (e, projectId) => {
        e.stopPropagation();
        confirmAlert({
            title: 'Confirm to delete', message: 'Are you sure you want to delete this project?', buttons: [{
                label: 'Yes', onClick: async () => {
                    try {
                        const response = await axios.post(`http://localhost:8000/myapp/delete_project/`, {
                            projectId: projectId,
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        if (response.status === 201) {
                            setProjects(projects.filter(project => project.id !== projectId));
                            fetchDeletedProjects();
                            setDialogMessage('File deleted successfully!');
                            setDialogOpen(true);
                        } else {
                            setDialogMessage('Can not delete file');
                            setDialogOpen(true);
                        }
                    } catch (error) {
                        console.error('Error deleting project:', error);
                    }
                }
            }, {
                label: 'No', onClick: () => console.log('Delete canceled')
            }]
        });
    };

    const handleCancel = () => {
        setImage(user.image || '');
        setName(user.username || '');
        setSex(user.sex || '');
        setBirthday(user.birth_date || '');
        setAddress(user.address || '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const random = uuidv4();
        let imagePublicURL = user.image;

        try {
            if (image) {
                const {data: imageUploadData, error: imageUploadError} = await supabase
                    .storage
                    .from('user_image')
                    .upload(`${user.id}/${random}_${image.name}`, image);

                if (imageUploadError) throw imageUploadError;

                const {data: imagePublicData} = supabase
                    .storage
                    .from('user_image')
                    .getPublicUrl(`${user.id}/${random}_${image.name}`);

                imagePublicURL = imagePublicData.publicUrl;
            }

            const formData = new FormData();
            formData.append('image', imagePublicURL);
            formData.append('fullname', fullName);
            formData.append('sex', sex);
            formData.append('birth_date', birthday);
            formData.append('address', address);

            console.log(imagePublicURL)
            console.log(name)
            console.log(sex)
            console.log(birthday)
            console.log(address)

            const response = await axios.post(`http://localhost:8000/myapp/update_user/${user.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            console.log(data);

            if (response.status === 200 && data) {
                localStorage.setItem('user', JSON.stringify(data));

                setDialogMessage('File updated successfully');
                setDialogOpen(true);
            } else {

                setDialogMessage('Can not update file');
                setDialogOpen(true);
            }
        } catch (error) {
            console.error('Error when update file:', error.message);

            setDialogMessage('Error to update file');
            setDialogOpen(true);
        }
    };

    const handlePasswordChange = () => {
        setOpenPasswordDialog(true);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {

            setDialogMessage('Password does not match');
            setDialogOpen(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('currentPassword', currentPassword);
            formData.append('newPassword', newPassword);

            const response = await axios.post(`http://localhost:8000/myapp/change_password/${user.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}`,
                },
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            const data = response.data;
            console.log(data);

            if (response.status === 200 && data) {
                localStorage.setItem('user', JSON.stringify(data));

                setDialogMessage('Change password successfully');
                setDialogOpen(true);

                setOpenPasswordDialog(false);
            } else {

                setDialogMessage('Can not update password');
                setDialogOpen(true);
            }
        } catch (error) {
            if (error.response) {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                if (error.response.status === 400) {


                    setDialogMessage('Current password is incorrect');
                    setDialogOpen(true);
                } else if (error.response.status === 500) {


                    setDialogMessage('Sever error, can not change password');
                    setDialogOpen(true);
                } else {


                    setDialogMessage('Have an error when change password');
                    setDialogOpen(true);
                }
            } else {


                setDialogMessage('Can not connect to sever');
                setDialogOpen(true);
            }
        }
    };

    const handleSentMessage = async (e) => {
    e.preventDefault();

    const now = new Date();
    const sentTime = now.toLocaleTimeString();
    const newMessage = {
        id: uuidv4(),
        content: messageContent,
        role: "user",
        sentTime: sentTime,
    };

    const updatedMessageContents = [...messageContents, newMessage]; // Lấy dữ liệu mới nhất

    try {
        const response = await axios.post(`http://localhost:8000/myapp/update_message/${user.id}/`, {
            messageContents: updatedMessageContents, // Sử dụng messageContents đã cập nhật
        }, {
            headers: {
                'Content-Type': 'application/json', // Sử dụng JSON thay vì multipart/form-data
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            fetchMessage();
            setMessageContent("");
        } else {
            setDialogMessage('Can not send message');
            setDialogOpen(true);
        }
    } catch (error) {
        console.error('Error when sending message:', error.message);
        setDialogMessage('Error sending message');
        setDialogOpen(true);
    }
};


    return (<div className="dashboard-container">
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
        <div className="sidebar">
            <button className="sign-in-btn" onClick={() => {
                setIsProfile(false)
            }}><MdOutlineDashboard className="ícon-sider"/> Dashboard
            </button>
            <button className="join-pro-btn" onClick={() => {
                setIsProfile(true)
            }}><FaUser className="ícon-sider"/> Profile
            </button>
            <button onClick={handleLogout} className="logout-btn">
                <CiLogout className="ícon-sider"/>
                Log out
            </button>
        </div>

        <main className="main-content">
            {isProfile ? <>
                <div className="profile">
                    <div className="user-avatar">
                        <label for="user-img">
                            <img src={imageUrl} className="user-img"/>
                        </label>
                        <input type="file" className="user-img" id="user-img" accept="image/*"
                               onChange={(e) => {
                                   if (e.target.files && e.target.files[0]) {
                                       setImageUrl(URL.createObjectURL(e.target.files[0]));
                                       setImage(e.target.files[0])
                                   }
                               }}
                               style={{display: "none"}}/>
                    </div>
                    <form onSubmit={handleSubmit} className="user-information-form">
                        <div className="user-information-wrap">

                            <div className="user-information user-full-name">
                                <TextField
                                    label="Full Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className="user-full-name-value"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="user-information user-name">
                                <TextField
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className="user-name-value"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled
                                />
                            </div>

                            <div className="user-information user-email">
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className="user-email-value"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled
                                />
                            </div>

                            <div className="user-information user-password">
                                <label className="user-password-label">Password</label>
                                <Button variant="contained" fullWidth style={{marginTop: '15px'}}
                                        className="user-password-change"
                                        onClick={handlePasswordChange}>
                                    Change Password
                                </Button>
                            </div>

                            <div className="user-information user-sex">
                                <TextField
                                    select
                                    label="Sex"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className="user-sex-value"
                                    value={sex}
                                    onChange={(e) => setSex(e.target.value)}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </TextField>
                            </div>

                            <div className="user-information user-birthday">
                                <TextField
                                    label="Birthday"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className="user-birthday-value"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onFocus={(e) => e.target.showPicker()}
                                />
                            </div>

                            <div className="user-information user-address">
                                <TextField
                                    label="Address"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className="user-address-value"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="user-information action-create">
                            <Button variant="contained" component="label" fullWidth style={{marginTop: '15px'}}
                                    onClick={handleCancel}
                                    className="cancle-btn active-btn">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" fullWidth style={{marginTop: '15px'}}
                                    className="add-new-btn active-btn">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
                <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Current Password"
                            type={showCurrentPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (<InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePasswordVisibility(setShowCurrentPassword, showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </IconButton>
                                </InputAdornment>)
                            }}
                        />
                        <TextField
                            label="New Password"
                            type={showNewPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (<InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePasswordVisibility(setShowNewPassword, showNewPassword)}
                                    >
                                        {showNewPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </IconButton>
                                </InputAdornment>)
                            }}
                        />
                        <TextField
                            label="Confirm New Password"
                            type={showConfirmPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (<InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePasswordVisibility(setShowConfirmPassword, showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </IconButton>
                                </InputAdornment>)
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPasswordDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handlePasswordSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </> : <>
                <div className="top-bar">
                    <button className="create-project-btn" onClick={createProject}>Create Project</button>
                </div>
                <div className="search-trash-bar">
                    <input type="search" placeholder="Search" className="search-input"
                           value={searchKeyword}
                           onChange={handleSearchChange}/>
                    <button className="trash-btn" onClick={handleTrashClick}><GoTrash
                        className="trash-btn-icon"/>Trash
                    </button>
                </div>
                <div className="feedback-wrap">
                    <button className="feedback-btn" onClick={handleMessageClick}>Feedback</button>
                </div>
                {showMessage ? (<div className="message-box">
                    <div className="message-bar">
                        <span>Message</span>
                        <button className="close-mess-btn" onClick={() => {
                            setShowMessage(false)
                        }}><IoMdClose/></button>
                    </div>
                    <div className="message-content-wrap">
                        {Array.isArray(messageContents) && messageContents.map((message) => {
                            if (message.role === "user") {
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
                {isDialogOpen ? (<div className="dialog-overlay">
                    <div className="dialog-content">
                        <div className="dialog-header">
                            <h2>Trash</h2>
                            <button className="close-btn" onClick={handleCloseDialog}>✖</button>
                        </div>

                        <div className="dialog-body">
                            <h3>Recently moved ({deletedProjects.length})</h3>
                            <div className="items-list">
                            {deletedProjects.map((project) => (
                                    <div key={project.id} className="project-delete-card">
                                        <img src={imgTest} alt={`Project ${project.name}`}/>
                                        <span>{project.name}</span>
                                        <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                                        <button className="btn-option-project restore-btn"
                                                onClick={() => handleRestoreProject(project.id)}>
                                            <MdOutlineRestore
                                                className="restore-btn-icon"/> Restore
                                        </button>
                                    </div>))}
                            </div>
                        </div>

                        <div className="dialog-footer">
                            <div className="selected-info">1 Selected</div>
                            <div className="actions">
                                <button className="restore-btn" onClick={handleRestoreAllProject}>
                                    <MdOutlineRestorePage/>
                                </button>
                                <button className="delete-btn" onClick={handleDeleteAllProject}><GoTrash
                                    className="delete-btn-icon"/></button>
                            </div>
                        </div>
                    </div>
                </div>) : (<></>)}
                <section className="projects-section">
                    <h3>Projects ({projects && projects.length ? projects.length : 0})</h3>
                    {searchKeyword.length === 0 ? (projects.length === 0 ? (<p>Don't have any project</p>) : (
                        <div className="projects-grid">
                            {projects.map((project) => (<div key={project.id} className="project-card"
                                                             onClick={() => handleSelectProject(project.id)}
                                                             onContextMenu={(e) => handleRightClick(e, project.id)}>
                                <img src={imgTest} alt={`Project ${project.name}`}/>
                                <span>{project.name}</span>
                                <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                {contextMenu && contextMenu.projectId === project.id && (<ul
                                    className="context-menu"
                                    style={{
                                        top: `${contextMenu.y}px`,
                                        left: `${contextMenu.x}px`,
                                        position: 'absolute'
                                    }}
                                    onClick={(e) => e.stopPropagation()}>
                                    <button className="btn-option-project btn-open"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenProject(project.id);
                                            }}>Open
                                    </button>
                                    <button className="btn-option-project btn-delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProject(e, project.id);
                                            }}>Delete
                                    </button>
                                </ul>)}
                                {contextMenu && (<div className="overlay" onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickOutside();
                                }}></div>)}
                            </div>))}
                        </div>)) : (filteredProjects.length === 0 ? (<p>No matching projects found</p>) : (
                        <div className="projects-grid">
                            {filteredProjects.map((project) => (<div key={project.id} className="project-card"
                                                                     onClick={() => handleSelectProject(project.id)}
                                                                     onContextMenu={(e) => handleRightClick(e, project.id)}>
                                <img src={imgTest} alt={`Project ${project.name}`}/>
                                <span>{project.name}</span>
                                <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                {contextMenu && contextMenu.projectId === project.id && (<ul
                                    className="context-menu"
                                    style={{
                                        top: `${contextMenu.y}px`,
                                        left: `${contextMenu.x}px`,
                                        position: 'absolute'
                                    }}
                                    onClick={(e) => e.stopPropagation()}>
                                    <button className="btn-option-project btn-open"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenProject(project.id);
                                            }}>Open
                                    </button>
                                    <button className="btn-option-project btn-delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProject(e, project.id);
                                            }}>Delete
                                    </button>
                                </ul>)}
                                {contextMenu && (<div className="overlay" onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickOutside();
                                }}></div>)}
                            </div>))}
                        </div>))}


                </section>
            </>}
        </main>
    </div>);
};

export default User;
