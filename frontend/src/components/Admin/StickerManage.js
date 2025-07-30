import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {FiEdit, FiPlusCircle, FiTrash2} from "react-icons/fi";
import {confirmAlert} from "react-confirm-alert";
import {Link} from "react-router-dom";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const StickerManage = ({onOptionSelect}) => {
    const [stickerData, setStickerData] = useState([]);
    const token = localStorage.getItem('access_token');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');


    useEffect(() => {
        async function fetchStickerData() {
            try {
                const response = await axios.get('http://localhost:8000/myapp/get_all_stickers/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStickerData(response.data);
            } catch (error) {
                console.error('Error fetching sticker data:', error);
            }
        }

        fetchStickerData();
    }, []);

    const handleDelete = async (stickerId) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this audio?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axios.post(`http://localhost:8000/myapp/delete_sticker/`, {
                                stickerId: stickerId,
                            }, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            if (response.status === 201) {
                                setStickerData(stickerData.filter(sticker => sticker.id !== stickerId));

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

            <h1 className="content-heading">Sticker manage</h1>
            <button className="create-new active-btn"><Link className="link link-create"
                                                            to="/admin/sticker/create-sticker"
                                                            onClick={() => onOptionSelect('createSticker')}><FiPlusCircle
                className="icon"/>
                <span>New</span></Link></button>
            <table className="table-sticker-wrap table-display-data-wrap">
                <thead className="table-sticker-head table-display-data-head">
                <tr className="table-sticker-head-row table-display-data-head-row">
                    <th className="table-sticker-head-cell table-display-data-head-cell" style={{width: "15%"}}>Image
                    </th>
                    <th className="table-sticker-head-cell table-display-data-head-cell" style={{width: "15%"}}>Name
                    </th>
                    <th className="table-sticker-head-cell table-display-data-head-cell"
                        style={{width: "15%"}}>Category
                    </th>
                    <th className="table-sticker-head-cell table-display-data-head-cell" style={{width: "20%"}}>Created
                        At
                    </th>
                    <th className="table-sticker-head-cell table-display-data-head-cell" style={{width: "20%"}}>Updated
                        At
                    </th>
                    <th className="table-sticker-head-cell table-display-data-head-cell" style={{width: "20%"}}>Action
                    </th>
                </tr>
                </thead>
                <tbody className="table-sticker-body table-display-data-wrap-body">
                {stickerData.map((sticker) => (
                    <tr key={sticker.id} className="table-sticker-body-row table-display-data-body-row">
                        <td className="table-sticker-body-cell table-display-data-body-cell"
                            style={{width: "15%", textAlign: "center"}}>
                            <img src={sticker.sticker_file} alt={sticker.name}/>
                        </td>
                        <td className="table-sticker-body-cell table-display-data-body-cell"
                            style={{width: "15%"}}>{sticker.name}</td>
                        <td className="table-sticker-body-cell table-display-data-body-cell"
                            style={{width: "15%"}}>{sticker.category}</td>
                        <td className="table-sticker-body-cell table-display-data-body-cell" style={{
                            width: "20%",
                            textAlign: "center"
                        }}>{new Date(sticker.created_at).toLocaleString()}</td>
                        <td className="table-sticker-body-cell table-display-data-body-cell" style={{
                            width: "20%",
                            textAlign: "center"
                        }}>{new Date(sticker.updated_at).toLocaleString()}</td>
                        <td className="table-sticker-body-cell table-display-data-body-cell" style={{width: "20%"}}>
                            <div className="action-btn-wrap">
                                <button className="pushable edit-btn">
                                    <span className="shadow"></span>
                                    <span className="edge"></span>
                                    <Link className="link" to={`/admin/sticker/edit/${sticker.id}`}
                                          onClick={() => onOptionSelect('editSticker')}>
                                        <span className="front"><FiEdit className="icon"/> Edit</span>
                                    </Link>
                                </button>
                                <button className="pushable delete-btn" onClick={() => handleDelete(sticker.id)}>
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
    )
        ;
};

export default StickerManage;
