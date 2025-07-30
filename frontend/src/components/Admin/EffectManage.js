import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import {FiEdit, FiPlusCircle, FiTrash2} from "react-icons/fi";
import {confirmAlert} from "react-confirm-alert";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const EffectManage = ({onOptionSelect}) => {
    const [effectData, setEffectData] = useState([]);

    const token = localStorage.getItem('access_token');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');


    useEffect(() => {
        async function fetchEffectData() {
            try {
                const response = await axios.get('http://localhost:8000/myapp/get_all_effects/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEffectData(response.data);
            } catch (error) {
                console.error('Error fetching effect data:', error);
            }
        }

        fetchEffectData();
    }, []);

    const handleDelete = async (effectId) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this audio?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axios.post(`http://localhost:8000/myapp/delete_effect/`, {
                                effectId: effectId,
                            }, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            if (response.status === 201) {
                                setEffectData(effectData.filter(effect => effect.id !== effectId));

                                setDialogMessage('File deleted successfully!');
                                setDialogOpen(true);
                            } else {

                                setDialogMessage('Can not delete file!');
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
            <h1 className="content-heading">Effect manage</h1>
            <button className="create-new active-btn">
                <Link className="link link-create"
                      to="/admin/effect/create-effect"
                      onClick={() => onOptionSelect('createEffect')}>
                    <FiPlusCircle className="icon"/>
                    <span>New</span></Link>
            </button>
            <table className="table-effect-wrap table-display-data-wrap">
                <thead className="table-effect-head table-display-data-head">
                <tr className="table-effect-head-row table-display-data-head-row">
                    <th className="table-effect-head-cell table-display-data-head-cell" style={{width: "10%"}}>Image
                    </th>
                    <th className="table-effect-head-cell table-display-data-head-cell" style={{width: "20%"}}>Name</th>
                    <th className="table-effect-head-cell table-display-data-head-cell"
                        style={{width: "20%"}}>Category
                    </th>
                    <th className="table-effect-head-cell table-display-data-head-cell" style={{width: "20%"}}>Created
                        At
                    </th>
                    <th className="table-effect-head-cell table-display-data-head-cell" style={{width: "20%"}}>Updated
                        At
                    </th>
                    <th className="table-effect-head-cell table-display-data-head-cell" style={{width: "20%"}}>Action
                    </th>
                </tr>
                </thead>
                <tbody className="table-effect-body table-display-data-wrap-body">
                {effectData.map((effect) => (
                    <tr key={effect.id} className="table-effect-body-row table-display-data-body-row">
                        <td className="table-effect-body-cell table-display-data-body-cell"
                            style={{width: "10%", textAlign: "center"}}>
                            <img src={effect.image} alt={effect.name}/>
                        </td>
                        <td className="table-effect-body-cell table-display-data-body-cell"
                            style={{width: "20%"}}>{effect.name}</td>
                        <td className="table-effect-body-cell table-display-data-body-cell"
                            style={{width: "20%", textAlign: "center"}}>{effect.category}</td>
                        <td className="table-effect-body-cell table-display-data-body-cell"
                            style={{width: "20%", textAlign: "center"}}>
                            {new Date(effect.created_at).toLocaleString()}
                        </td>
                        <td className="table-effect-body-cell table-display-data-body-cell"
                            style={{width: "20%", textAlign: "center"}}>
                            {new Date(effect.updated_at).toLocaleString()}
                        </td>
                        <td className="table-effect-body-cell table-display-data-body-cell" style={{width: "20%"}}>
                            <div className="action-btn-wrap">
                                <button className="pushable edit-btn">
                                    <span className="shadow"></span>
                                    <span className="edge"></span>
                                    <Link className="link" to={`/admin/effect/edit/${effect.id}`}
                                          onClick={() => onOptionSelect('editEffect')}>
                                        <span className="front"><FiEdit className="icon"/> Edit</span>
                                    </Link>
                                </button>
                                <button className="pushable delete-btn" onClick={() => handleDelete(effect.id)}>
                                    <span className="shadow"></span>
                                    <span className="edge"></span>
                                    <span className="front"><FiTrash2 className="icon"/> Delete</span>
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

export default EffectManage;
