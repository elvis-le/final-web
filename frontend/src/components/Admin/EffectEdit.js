import React, {useEffect, useState} from 'react';
import {
    TextField,
    Button,
    MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material'
import axios from 'axios';
import {supabase} from '../../supabaseClient';
import {v4 as uuidv4} from "uuid";
import {Link, useNavigate} from "react-router-dom";

const EffectEdit = ({onOptionSelect, effectId}) => {
    const [effectData, setEffectData] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [config, setConfig] = useState({});
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');


    const token = localStorage.getItem('access_token');

    const categories = [
        {value: 'trending', label: 'Trending'},
        {value: 'nightclub', label: 'Nightclub'},
        {value: 'lens', label: 'Lens'},
        {value: 'retro', label: 'Retro'},
        {value: 'tv', label: 'TV'},
        {value: 'star', label: 'Star'},
        {value: 'trending_body', label: 'Trending Body'},
        {value: 'mood_body', label: 'Mood Body'},
        {value: 'mask_body', label: 'Mask Body'},
        {value: 'selfie_body', label: 'Selfie Body'},
    ];

    useEffect(() => {
        async function fetchEffectData() {
            try {
                const response = await axios.get(`http://localhost:8000/myapp/get_effect_by_id/${effectId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data) && response.data.length > 0) {
                    const effectItem = response.data[0];
                    setEffectData(effectItem);
                    setName(effectItem.name || '');
                    setCategory(effectItem.category || '');
                    setConfig(JSON.stringify(effectItem.config) || '');
                } else {
                    console.error('No effect data found for the given ID.');
                }
            } catch (error) {
                console.error('Error fetching effect data:', error);
            }
        }

        fetchEffectData();
    }, [effectId, token]);

    function handleJsonChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target.result;
                setConfig(fileContent);
            };
            reader.readAsText(file);
        } else {
            console.error("Invalid file input");
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const random = uuidv4();
        let imagePublicURL = effectData.image;

        try {
            if (imageFile) {
                const {data: imageUploadData, error: imageUploadError} = await supabase
                    .storage
                    .from('effect_files')
                    .upload(`${effectData.category}/${random}_${imageFile.name}`, imageFile);

                if (imageUploadError) throw imageUploadError;

                const {data: imagePublicData} = supabase
                    .storage
                    .from('effect_files')
                    .getPublicUrl(`${effectData.category}/${random}_${imageFile.name}`);

                imagePublicURL = imagePublicData.publicUrl;
            }

            const formData = new FormData();
            formData.append('image', imagePublicURL);
            formData.append('name', name);
            formData.append('category', category);
            formData.append('config', config);

            const response = await axios.post(`http://localhost:8000/myapp/update_effect/${effectData.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {

                setDialogMessage('File update successful!');
                setDialogOpen(true);
                navigate('/admin/effect', {state: {onOptionSelectValue: 'effect'}});
            } else {

                setDialogMessage('Can not update file');
                setDialogOpen(true);
            }
        } catch (error) {
            console.error('Error to update file:', error.message);

            setDialogMessage('Error to update file');
            setDialogOpen(true);
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
            <form onSubmit={handleSubmit} style={{maxWidth: '400px', height: "fit-content", margin: '0 auto'}}>
                <TextField
                    label="Effect Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextField
                    select
                    label="Category"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    {categories.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="contained" component="label" fullWidth style={{marginTop: '15px'}}>
                    Upload Config File (JSON)
                    <input type="file" hidden onChange={handleJsonChange} accept="application/json"/>
                </Button>

                <Button variant="contained" component="label" fullWidth style={{marginTop: '15px'}}>
                    Upload Image File
                    <input type="file" hidden onChange={handleImageChange} accept="image/*"/>
                </Button>
                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Selected Image" width="100"/>}
                <div className="action-create">
                    <button type="button" className="cancle-btn active-btn"><Link className="link" to="/admin/effect"
                                                                                  onClick={() => onOptionSelect('effect')}>
                        <span>Cancle</span></Link></button>
                    <button type="submit" className="add-new-btn active-btn">
                        Save Effect
                    </button>
                </div>
            </form>
        </>
    );
};

export default EffectEdit
