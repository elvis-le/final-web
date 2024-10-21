import React, {useEffect, useState} from "react";
import { GoTrash } from "react-icons/go";
import imgTest from "../../assets/images/Nitro_Wallpaper_01_3840x2400.jpg";
import { MdOutlineRestore } from "react-icons/md";
import {confirmAlert} from "react-confirm-alert";
import axios from "axios";

const DeletedProjectsDialog = ({ isOpen, onClose }) => {
  const [deletedProjects, setDeletedProjects] = useState([]);
  const token = localStorage.getItem('access_token');



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
            title: 'Confirm to delete',
            message: 'Are you sure you want to restore this project?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axios.post(`http://localhost:8000/myapp/restore_project/`, {
                                projectId: projectId,                              }, {
                                headers: {
                                    Authorization: `Bearer ${token}`,                                  },
                            });
                            if (response.status === 201) {
                                setDeletedProjects(deletedProjects.filter(project => project.id !== projectId));
                                alert('File is restore successfully!');
                            } else {
                                alert('Can not restore');
                            }
                        } catch (error) {
                            console.error('Error restore project:', error);
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


  if (!isOpen) return null;
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        {/* Header Section */}
        <div className="dialog-header">
          <h2>Trash</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Body Section */}
        <div className="dialog-body">
          <h3>Recently moved ({deletedProjects.length})</h3>
          <div className="items-list">
            {deletedProjects.map((project) => (
              <div key={project.id} className="project-delete-card">
                      <img src={imgTest} alt={`Project ${project.name}`}/>
                      <span>{project.name}</span>
                      <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                <button className="btn-option-project restore-btn"  onClick={() => handleRestoreProject(project.id)}><MdOutlineRestore  className="restore-btn-icon"/> Restore</button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="dialog-footer">
          <div className="selected-info">1 Selected</div>
          <div className="actions">
            <button className="restore-btn">🔄</button>
            <button className="delete-btn"><GoTrash className="delete-btn-icon"/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletedProjectsDialog;
