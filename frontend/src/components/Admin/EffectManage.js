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

const EffectManage = () => {
    const [effectFile, setEffectFile] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [isCreate, setIsCreate] = useState(false);
    const [effectData, setEffectData] = useState([]);

            const token = localStorage.getItem('access_token');

    const categories = [
        { value: 'trending', label: 'Trending' },
{ value: 'pro', label: 'Pro' },
{ value: 'nightclub', label: 'Nightclub' },
{ value: 'lens', label: 'Lens' },
{ value: 'retro', label: 'Retro' },
{ value: 'tv', label: 'TV' },
{ value: 'star', label: 'Star' },
{ value: 'trending_body', label: 'Trending Body' },
{ value: 'pro_body', label: 'Pro Body' },
{ value: 'mood_body', label: 'Mood Body' },
{ value: 'mask_body', label: 'Mask Body' },
{ value: 'selfie_body', label: 'Selfie Body' },
{ value: 'dark_body', label: 'Dark Body' },
{ value: 'image_body', label: 'Image Body' }
    ];

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

    const handleSwitch = () => {
        setIsCreate(!isCreate);
    };
    const handleFileChange = (e) => {
        setEffectFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!effectFile) {
            alert("Please upload an effect file");
            return;
        }

        try {
            const {data, error} = await supabase
                .storage
                .from('effect_files')
                .upload(`${category}/${effectFile.name}`, effectFile);

            if (error) {
                throw error;
            }

            const {data: publicURL} = supabase
                .storage
                .from('effect_files')
                .getPublicUrl(`${category}/${effectFile.name}`);

            if (!publicURL) {
                alert('Failed to get public URL');
                return;
            }

            const formData = new FormData();
            formData.append('effect_file', publicURL.publicUrl);
            formData.append('name', name);
            formData.append('category', category);


            const response = await axios.post('http://localhost:8000/myapp/upload_effect/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                alert('File uploaded and saved successfully!');
            } else {
                alert('Failed to save effect details to database');
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
                            Upload Effect File
                            <input type="file" hidden onChange={handleFileChange} accept="effect/*"/>
                        </Button>
                        {effectFile && <p>File: {effectFile.name}</p>}
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '20px'}}>
                            Add Effect
                        </Button>
                    </form>
                    <button onClick={handleSwitch}>Cancle</button>
                </>
            ) : (
                <>
                    <h1>Effect manage</h1>
                    <button onClick={handleSwitch}>new</button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Artist</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Effect File</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Updated At</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {effectData.map((effect) => (
                                    <TableRow key={effect.id}>
                                        <TableCell>{effect.name}</TableCell>
                                        <TableCell>{effect.artist}</TableCell>
                                        <TableCell>{effect.category}</TableCell>
                                        <TableCell><a href={effect.effect_file}>File link</a></TableCell>
                                        <TableCell>{new Date(effect.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(effect.updated_at).toLocaleString()}</TableCell>
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

export default EffectManage;
