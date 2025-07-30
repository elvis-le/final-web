import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {confirmAlert} from "react-confirm-alert";
import {FiEdit, FiPlusCircle, FiTrash2} from "react-icons/fi";
import {Link} from "react-router-dom";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const TextManage = ({onOptionSelect}) => {
    const [textData, setTextData] = useState([]);
    const token = localStorage.getItem('access_token');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');


    const categories = [
        {value: 'default', label: 'Default'},
        {value: 'trending', label: 'Trending'},
        {value: 'basic', label: 'Basic'},
        {value: 'multicolor', label: 'Multicolor'}
    ];

    useEffect(() => {
        async function fetchTextData() {
            try {
                const response = await axios.get('http://localhost:8000/myapp/get_all_texts/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTextData(response.data);
            } catch (error) {
                console.error('Error fetching text data:', error);
            }
        }

        fetchTextData();
    }, []);

    const handleDelete = async (textId) => {
        console.log({textId})
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this audio?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axios.post(`http://localhost:8000/myapp/delete_text/`, {
                                textId: textId,
                            }, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            if (response.status === 201) {
                                setTextData(textData.filter(text => text.id !== textId));

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

            <h1 className="content-heading">Text manage</h1>
            <button className="create-new active-btn"><Link className="link link-create"
                                                            to="/admin/text/create-text"
                                                            onClick={() => onOptionSelect('createText')}><FiPlusCircle
                className="icon"/>
                <span>New</span></Link></button>
            <table className="table-text-wrap table-display-data-wrap">
                <thead className="table-text-head table-display-data-head">
                <tr className="table-text-head-row table-display-data-head-row">
                    <th className="table-text-head-cell table-display-data-head-cell" style={{width: "10%"}}>Image</th>
                    <th className="table-text-head-cell table-display-data-head-cell" style={{width: "20%"}}>Name</th>
                    <th className="table-text-head-cell table-display-data-head-cell" style={{width: "10%"}}>Content
                    </th>
                    <th className="table-text-head-cell table-display-data-head-cell" style={{width: "10%"}}>Category
                    </th>
                    <th className="table-text-head-cell table-display-data-head-cell" style={{width: "10%"}}>Text File
                    </th>
                    <th className="table-text-head-cell table-display-data-head-cell" style={{width: "15%"}}>Created
                        At
                    </th>
                    <th className="table-text-head-cell table-display-data-head-cell" style={{width: "15%"}}>Updated
                        At
                    </th>
                    <th className="table-text-head-cell table-display-data-head-cell" style={{width: "20%"}}>Action</th>
                </tr>
                </thead>
                <tbody className="table-text-body table-display-data-wrap-body">
                {textData.map((text) => (
                    <tr key={text.id} className="table-text-body-row table-display-data-body-row">
                        <td className="table-text-body-cell table-display-data-body-cell"
                            style={{width: "10%", textAlign: "center"}}>
                            <img src={text.image} alt={text.content}/>
                        </td>
                        <td className="table-text-body-cell table-display-data-body-cell"
                            style={{width: "10%"}}>{text.name}</td>
                        <td className="table-text-body-cell table-display-data-body-cell"
                            style={{width: "10%", textAlign: "center"}}>{text.content}</td>
                        <td className="table-text-body-cell table-display-data-body-cell"
                            style={{width: "10%"}}>{text.category}</td>
                        <td className="table-text-body-cell table-display-data-body-cell"
                            style={{width: "10%", textAlign: "center"}}>
                            <a href={text.text_file} target="_blank" rel="noopener noreferrer">File link</a>
                        </td>
                        <td className="table-text-body-cell table-display-data-body-cell"
                            style={{width: "20%"}}>{new Date(text.created_at).toLocaleString()}</td>
                        <td className="table-text-body-cell table-display-data-body-cell"
                            style={{width: "20%"}}>{new Date(text.updated_at).toLocaleString()}</td>
                        <td className="table-text-body-cell table-display-data-body-cell" style={{width: "20%"}}>
                            <div className="action-btn-wrap">
                                <button className="pushable edit-btn">
                                    <span className="shadow"></span>
                                    <span className="edge"></span>
                                    <Link className="link" to={`/admin/text/edit/${text.id}`}
                                          onClick={() => onOptionSelect('editText')}>
                                        <span className="front"><FiEdit className="icon"/> Edit</span>
                                    </Link>
                                </button>
                                <button className="pushable delete-btn" onClick={() => handleDelete(text.id)}>
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

export default TextManage;
