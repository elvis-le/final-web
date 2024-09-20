import React, {useEffect, useState} from 'react';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TextField,
    Button,
    MenuItem
} from '@mui/material'
import axios from 'axios';
import {supabase} from '../../supabaseClient';

const StickerManage = () => {
    const [stickerFile, setStickerFile] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [isCreate, setIsCreate] = useState(false);
    const [stickerData, setStickerData] = useState([]);
    const token = localStorage.getItem('access_token');

    const categories = [
        { value: 'trending', label: 'Trending' },
{ value: 'easter_holiday', label: 'Easter Holiday' },
{ value: 'fun', label: 'Fun' },
{ value: 'troll_face', label: 'Troll Face' },
{ value: 'gaming', label: 'Gaming' },
{ value: 'emoji', label: 'Emoji' }
    ];

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

    const handleSwitch = () => {
        setIsCreate(!isCreate);
    };
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
            const {data, error} = await supabase
                .storage
                .from('sticker_files')
                .upload(`${category}/${stickerFile.name}`, stickerFile);

            if (error) {
                throw error;
            }

            const {data: publicURL} = supabase
                .storage
                .from('sticker_files')
                .getPublicUrl(`${category}/${stickerFile.name}`);

            if (!publicURL) {
                alert('Failed to get public URL');
                return;
            }

            const formData = new FormData();
            formData.append('sticker_file', publicURL.publicUrl);
            formData.append('name', name);
            formData.append('category', category);



            const response = await axios.post('http://localhost:8000/myapp/upload_sticker/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                alert('File uploaded and saved successfully!');
            } else {
                alert('Failed to save sticker details to database');
            }

        } catch (error) {
            console.error('Error uploading file:', error.message);
            alert('Error uploading file');
        }
    };

    return (
        <>
            {isCreate ? (
                <>
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
                        {stickerFile && <p>File: {stickerFile.name}</p>}
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '20px'}}>
                            Add Sticker
                        </Button>
                    </form>
                    <button onClick={handleSwitch}>Cancle</button>
                </>
            ) : (
                <>
                    <h1>Sticker manage</h1>
                    <button onClick={handleSwitch}>new</button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Artist</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Sticker File</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Updated At</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stickerData.map((sticker) => (
                                    <TableRow key={sticker.id}>
                                        <TableCell>{sticker.name}</TableCell>
                                        <TableCell>{sticker.artist}</TableCell>
                                        <TableCell>{sticker.category}</TableCell>
                                        <TableCell><a href={sticker.sticker_file}>File link</a></TableCell>
                                        <TableCell>{new Date(sticker.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(sticker.updated_at).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <button>Edit</button>
                                            <button>Delete</button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </>
    )
        ;
};

export default StickerManage;
