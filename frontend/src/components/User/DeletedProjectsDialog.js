import React, {useEffect, useState} from "react";
import {GoTrash} from "react-icons/go";
import imgTest from "../../assets/images/Nitro_Wallpaper_01_3840x2400.jpg";
import {MdOutlineRestore, MdOutlineRestorePage} from "react-icons/md";
import {confirmAlert} from "react-confirm-alert";
import axios from "axios";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const DeletedProjectsDialog = ({isOpen, onClose}) => {
    const [deletedProjects, setDeletedProjects] = useState([]);
    const token = localStorage.getItem('access_token');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
        const fetchDeletedProjects = async () => {
            if (!token) {
                console.error("Token does not exist");
                return;
            }

            console.log("Token was send:", token);

            try {
                const response = await axios.get('http://localhost:8000/myapp/get_user_deleted_projects/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
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

        fetchDeletedProjects();
    }, []);

    const handleRestoreProject = async (projectId) => {
        confirmAlert({
            title: 'Confirm to restore',
            message: 'Are you sure you want to restore this project?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
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
                },
                {
                    label: 'No',
                    onClick: () => console.log('Restore canceled')
                }
            ]
        });
    };

    const handleRestoreAllProject = async () => {
        confirmAlert({
            title: 'Confirm to restore all project',
            message: 'Are you sure you want to restore all project?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axios.post(`http://localhost:8000/myapp/restore_all_project/`,
                                {}, {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                });
                            if (response.status === 200) {
                                setDeletedProjects([])
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
                },
                {
                    label: 'No',
                    onClick: () => console.log('Restore canceled')
                }
            ]
        });
    }

    const handleDeleteAllProject = async () => {
        confirmAlert({
            title: 'Confirm to delete all project',
            message: 'Are you sure you want to delete all project?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axios.post(`http://localhost:8000/myapp/delete_all_project/`,
                                {}, {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                });
                            if (response.status === 200) {

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
                },
                {
                    label: 'No',
                    onClick: () => console.log('Delete canceled')
                }
            ]
        });
    }




    if (!isOpen) return null;
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
            <div className="dialog-overlay">
                <div className="dialog-content">
                    <div className="dialog-header">
                        <h2>Trash</h2>
                        <button className="close-btn" onClick={onClose}>✖</button>
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
                                            onClick={() => handleRestoreProject(project.id)}><MdOutlineRestore
                                        className="restore-btn-icon"/> Restore
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dialog-footer">
                        <div className="selected-info">1 Selected</div>
                        <div className="actions">
                            <button className="restore-btn" onClick={handleRestoreAllProject}><MdOutlineRestorePage/>
                            </button>
                            <button className="delete-btn" onClick={handleDeleteAllProject}><GoTrash
                                className="delete-btn-icon"/></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeletedProjectsDialog;

