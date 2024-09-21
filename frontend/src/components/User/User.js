import React, { useState, useEffect } from "react";
import './User.scss';
import { useNavigate } from "react-router-dom";
import imgTest from '../../assets/images/Nitro_Wallpaper_01_3840x2400.jpg';
import axios from 'axios';

const User = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

useEffect(() => {
  const fetchProjects = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error("Token does not exist");
      return;
    }

    console.log("Token was send:", token);

    try {
      const response = await axios.get('http://localhost:8000/myapp/get_user_projects/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
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

  fetchProjects();
}, []);


  const createProject = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post('http://localhost:8000/myapp/create_project/',
      { project_name: new Date().toISOString().slice(0, 10) },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

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

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <button className="sign-in-btn">Dashboard</button>
        <button className="join-pro-btn">Profile</button>
        <button onClick={handleLogout} className="logout-btn">
          Log out
        </button>
      </aside>

      <main className="main-content">
        <div className="top-bar">
          <button className="create-project-btn" onClick={createProject}>Create Project</button>
        </div>
        <div className="search-trash-bar">
          <input type="search" placeholder="Search" className="search-input" />
          <button className="view-toggle-btn">View Toggle</button>
          <button className="trash-btn">Trash</button>
        </div>
        <section className="projects-section">
          <h3>Projects ({projects && projects.length ? projects.length : 0})</h3>
          {projects.length === 0 ? (
              <p>Không có dự án nào.</p>
          ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-card" onClick={() => handleSelectProject(project.id)}>
                      <img src={imgTest} alt={`Project ${project.name}`}/>
                      <span>{project.name}</span>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                ))}
              </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default User;
