import React, {useEffect, useState} from 'react';
import {
    TextField,
    Button,
    MenuItem
} from '@mui/material'
import axios from 'axios';
import {supabase} from '../../supabaseClient';
import {v4 as uuidv4} from "uuid";
import {Link} from "react-router-dom";

const EffectCreate = ({ onOptionSelect }) => {
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [config, setConfig] = useState({});

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

        try {
            const random = uuidv4();

            const {data: imageUploadData, error: imageUploadError} = await supabase
                .storage
                .from('effect_files')
                .upload(`${category}/${random}_${imageFile.name}`, imageFile);

            if (imageUploadError) throw imageUploadError;

            const {data: imagePublicURL} = supabase
                .storage
                .from('effect_files')
                .getPublicUrl(`${category}/${random}_${imageFile.name}`);

            if (!imagePublicURL) throw new Error('Failed to get public image URL');

            const formData = new FormData();
            formData.append('image', imagePublicURL.publicUrl);
            formData.append('name', name);
            formData.append('category', category);
            formData.append('config', config);

            const response = await axios.post('http://localhost:8000/myapp/upload_effect/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                alert('Files uploaded and saved successfully!');
            } else {
                alert('Failed to save effect and image details to database');
            }

        } catch (error) {
            console.error('Error uploading file:', error.message);
            alert('Error uploading file');
        }
    };

    return (
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
                        Add Effect
                    </button>
                </div>
            </form>
    );
};

export default EffectCreate
