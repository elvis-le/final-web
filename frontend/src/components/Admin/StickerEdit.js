import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {supabase} from "../../supabaseClient";
import axios from "axios";
import {Button, MenuItem, TextField} from "@mui/material";
import {Link} from "react-router-dom";

const StickerEdit = ({ onOptionSelect, stickerId }) => {
    const [stickerData, setStickerData] = useState([]);
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


    useEffect(() => {
        async function fetchStickerData() {
            try {
                const response = await axios.get(`http://localhost:8000/myapp/get_sticker_by_id/${stickerId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data) && response.data.length > 0) {
                const stickerItem = response.data[0];
                setStickerData(stickerItem);
                setName(stickerItem.name || '');
                setCategory(stickerItem.category || '');
            } else {
                console.error('No sticker data found for the given ID.');
            }
            } catch (error) {
                console.error('Error fetching sticker data:', error);
            }
        }

        fetchStickerData();
    }, [stickerId, token]);

    const handleFileChange = (e) => {
        setStickerFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const random = uuidv4();
    let stickerPublicURL = stickerData.sticker_file;
    let imagePublicURL = stickerData.image;

    try {
        if (stickerFile) {
            const { data: stickerUploadData, error: stickerUploadError } = await supabase
                .storage
                .from('sticker_files')
                .upload(`${stickerData.category}/${random}_${stickerFile.name}`, stickerFile);

            if (stickerUploadError) throw stickerUploadError;

            const { data: stickerPublicData } = supabase
                .storage
                .from('sticker_files')
                .getPublicUrl(`${stickerData.category}/${random}_${stickerFile.name}`);

            stickerPublicURL = stickerPublicData.publicUrl;
        }
        console.log({stickerPublicURL})

        if (imageFile) {
            const { data: imageUploadData, error: imageUploadError } = await supabase
                .storage
                .from('sticker_files')
                .upload(`${stickerData.category}/${random}_${imageFile.name}`, imageFile);

            if (imageUploadError) throw imageUploadError;

            const { data: imagePublicData } = supabase
                .storage
                .from('sticker_files')
                .getPublicUrl(`${stickerData.category}/${random}_${imageFile.name}`);

            imagePublicURL = imagePublicData.publicUrl;
        }

        const formData = new FormData();
        formData.append('sticker_file', stickerPublicURL);
        formData.append('image', imagePublicURL);
        formData.append('name', name);
        formData.append('category', category);

        const response = await axios.post(`http://localhost:8000/myapp/update_sticker/${stickerData.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 201) {
            alert('File đã được cập nhật thành công!');
        } else {
            alert('Không thể cập nhật file');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật file:', error.message);
        alert('Lỗi khi cập nhật file');
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
                    Save Sticker
                </button>
            </div>
        </form>
    )
}

export default StickerEdit