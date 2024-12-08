import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {FiPlusCircle, FiEdit, FiTrash2} from "react-icons/fi";

const AudioManage = ({onOptionSelect}) => {
    const [audioData, setAudioData] = useState([]);
    const token = localStorage.getItem('access_token');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
        async function fetchAudioData() {
            try {
                const response = await axios.get('http://localhost:8000/myapp/get_all_audios/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAudioData(response.data);
            } catch (error) {
                console.error('Error fetching audio data:', error);
            }
        }

        fetchAudioData();
    }, []);

    const handleDelete = async (audioId) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this audio?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axios.post(`http://localhost:8000/myapp/delete_audio/`, {
                                audioId: audioId,
                            }, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            if (response.status === 201) {
                                setAudioData(audioData.filter(audio => audio.id !== audioId));
                                setDialogMessage('File is deleted successful');
                                setDialogOpen(true);
                            } else {
                                setDialogMessage('Can not delete file');
                                setDialogOpen(true);
                            }
                        } catch (error) {
                            console.error('Error deleting audio:', error);
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
            <h1 className="content-heading">Audio manage</h1>
            <button className="create-new active-btn"><Link className="link link-create" to="/admin/audio/create-audio"
                                                            onClick={() => onOptionSelect('createAudio')}><FiPlusCircle
                className="icon"/>
                <span>New</span></Link></button>
            <table className="table-audio-wrap table-display-data-wrap">
                <thead className="table-audio-head table-display-data-head">
                <tr className="table-audio-head-row table-display-data-head-row">
                    <th className="table-audio-head-cell table-display-data-head-cell" style={{width: "10%"}}>Image</th>
                    <th className="table-audio-head-cell table-display-data-head-cell" style={{width: "15%"}}>Name</th>
                    <th className="table-audio-head-cell table-display-data-head-cell" style={{width: "15%"}}>Artist
                    </th>
                    <th className="table-audio-head-cell table-display-data-head-cell" style={{width: "10%"}}>Category
                    </th>
                    <th className="table-audio-head-cell table-display-data-head-cell" style={{width: "10%"}}>Audio
                        File
                    </th>
                    <th className="table-audio-head-cell table-display-data-head-cell" style={{width: "10%"}}>Created
                        At
                    </th>
                    <th className="table-audio-head-cell table-display-data-head-cell" style={{width: "10%"}}>Updated
                        At
                    </th>
                    <th className="table-audio-head-cell table-display-data-head-cell" style={{width: "20%"}}>Action
                    </th>
                </tr>
                </thead>
                <tbody className="table-audio-wrap-body table-display-data-wrap-body">
                {audioData.map((audio) => (
                    <tr key={audio.id} className="table-audio-body-row table-display-data-body-row">
                        <td className="table-audio-body-cell table-display-data-body-cell"
                            style={{width: "10%", textAlign: "center"}}><img src={audio.image}/></td>
                        <td className="table-audio-body-cell table-display-data-body-cell"
                            style={{width: "15%"}}>{audio.name}</td>
                        <td className="table-audio-body-cell table-display-data-body-cell"
                            style={{width: "15%"}}>{audio.artist}</td>
                        <td className="table-audio-body-cell table-display-data-body-cell"
                            style={{width: "10%"}}>{audio.category}</td>
                        <td className="table-audio-body-cell table-display-data-body-cell"
                            style={{width: "10%", textAlign: "center"}}><a href={audio.audio_file}>File
                            link</a></td>
                        <td className="table-audio-body-cell table-display-data-body-cell" style={{
                            width: "10%",
                            textAlign: "center"
                        }}>{new Date(audio.created_at).toLocaleString()}</td>
                        <td className="table-audio-body-cell table-display-data-body-cell" style={{
                            width: "10%",
                            textAlign: "center"
                        }}>{new Date(audio.updated_at).toLocaleString()}</td>
                        <td className="table-audio-body-cell table-display-data-body-cell" style={{width: "20%"}}>
                            <div className="action-btn-wrap">
                                <button className="pushable edit-btn">
                                    <span className="shadow"></span>
                                    <span className="edge"></span>
                                    <Link className="link" to={`/admin/audio/edit/${audio.id}`}
                                          onClick={() => onOptionSelect('editAudio')}>
                                        <span className="front"><FiEdit className="icon"/>Edit</span></Link>
                                </button>
                                <button className="pushable delete-btn" onClick={() => handleDelete(audio.id)}>
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

export default AudioManage;
