import {Button, MenuItem, TextField} from "@mui/material";
import React, {useState} from "react";
import {v4 as uuidv4} from "uuid";
import {supabase} from "../../supabaseClient";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

const StickerCreate = ({ onOptionSelect }) => {
    const [stickerFile, setStickerFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const token = localStorage.getItem('access_token');
    const categories = [
        {value: 'trending', label: 'Trending'},
        {value: 'easter_holiday', label: 'Easter Holiday'},
        {value: 'fun', label: 'Fun'},
        {value: 'troll_face', label: 'Troll Face'},
        {value: 'gaming', label: 'Gaming'},
        {value: 'emoji', label: 'Emoji'}
    ];
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setStickerFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stickerFile) {
            alert("Please upload an sticker file");
            return;
        }

        try {
            const random = uuidv4();
            const {data: stickerUploadData, error: stickerUploadError} = await supabase
                .storage
                .from('sticker_files')
                .upload(`${category}/${random}_${stickerFile.name}`, stickerFile);

            if (stickerUploadError) throw stickerUploadError;

            const {data: stickerPublicURL} = supabase
                .storage
                .from('sticker_files')
                .getPublicUrl(`${category}/${random}_${stickerFile.name}`);

            if (!stickerPublicURL) throw new Error('Failed to get public sticker URL');

            const formData = new FormData();
            formData.append('sticker_file', stickerPublicURL.publicUrl);
            formData.append('name', name);
            formData.append('category', category);

            const response = await axios.post('http://localhost:8000/myapp/upload_sticker/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                alert('Files uploaded and saved successfully!');
            navigate('/admin/sticker', { state: { onOptionSelectValue: 'sticker' } });
            } else {
                alert('Failed to save sticker and image details to database');
            }

        } catch (error) {
            console.error('Error uploading files:', error.message);
            alert('Error uploading files');
        }

    };

    return (
        <form onSubmit={handleSubmit} style={{maxWidth: '400px', margin: '0 auto'}}>
            <TextField
                label="Sticker Name"
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
                Upload Sticker File
                <input type="file" hidden onChange={handleFileChange} accept="sticker/*"/>
            </Button>
            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Selected Image" width="100"/>}
            {stickerFile && <p>File: {stickerFile.name}</p>}
            <div className="action-create">
                <button type="button" className="cancle-btn active-btn"><Link className="link" to="/admin/sticker"
                                                                              onClick={() => onOptionSelect('sticker')}>
                    <span>Cancle</span></Link></button>
                <button type="submit" className="add-new-btn active-btn">
                    Add Sticker
                </button>
            </div>
        </form>
    )
}
export default StickerCreate