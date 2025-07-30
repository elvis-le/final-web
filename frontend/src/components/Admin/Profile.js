import React, {useEffect, useState} from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import {v4 as uuidv4} from "uuid";
import {supabase} from "../../supabaseClient";
import {
    TextField,
    Button,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    IconButton,
    DialogContentText
} from '@mui/material';
import {FaEye, FaEyeSlash} from "react-icons/fa";

const Profile = ({onOptionSelect}) => {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState(user.image || '');
    const [name, setName] = useState(user.username || '');
    const [fullName, setFullName] = useState(user.fullname || '');
    const [email, setEmail] = useState(user.email || '');
    const [sex, setSex] = useState(user.sex || '');
    const [birthday, setBirthday] = useState(user.birth_date || '');
    const [address, setAddress] = useState(user.address || '');

    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const handleTogglePasswordVisibility = (setShowPassword, showPassword) => {
        setShowPassword(!showPassword);
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

            const response = await axios.post(`http://localhost:8000/myapp/update_user/${user.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            console.log(data);

            if (response.status === 200 && data) {
                localStorage.setItem('user', JSON.stringify(data));

                setDialogMessage('File updated successfully!');
                setDialogOpen(true);
            } else {
                setDialogMessage('Can not update file!');
                setDialogOpen(true);
            }
        } catch (error) {
            console.error('Error while updating file:', error.message);

            setDialogMessage('Error to update file!');
            setDialogOpen(true);
        }
    };

    const handlePasswordChange = () => {
        setOpenPasswordDialog(true);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setDialogMessage('Password does not match!');
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
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            const data = response.data;
            console.log(data);
            if (response.status === 200 && data) {
                localStorage.setItem('user', JSON.stringify(data));
                setDialogMessage('Change password successfully!');
                setDialogOpen(true);
                setOpenPasswordDialog(false);
            } else {
                setDialogMessage('Can not change password!');
                setDialogOpen(true);
            }
        } catch (error) {
            if (error.response) {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                if (error.response.status === 400) {
                    setDialogMessage(error.response.data.message || 'Current password is incorrect');
                    setDialogOpen(true);
                } else if (error.response.status === 500) {
                    setDialogMessage('Sever error, can not change password!');
                    setDialogOpen(true);
                } else {
                    setDialogMessage('An error occurred while changing password.!');
                    setDialogOpen(true);
                }
            } else {
                setDialogMessage('Can not connect to sever!');
                setDialogOpen(true);
            }
        }
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
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePasswordVisibility(setShowCurrentPassword, showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </IconButton>
                                </InputAdornment>
                            )
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
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePasswordVisibility(setShowNewPassword, showNewPassword)}
                                    >
                                        {showNewPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </IconButton>
                                </InputAdornment>
                            )
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
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePasswordVisibility(setShowConfirmPassword, showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </IconButton>
                                </InputAdornment>
                            )
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
        </>
    );
};

export default Profile;
