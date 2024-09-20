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

const AudioManage = () => {
    const [audioFile, setAudioFile] = useState(null);
    const [name, setName] = useState('');
    const [artist, setArtist] = useState('');
    const [category, setCategory] = useState('');
    const [isCreate, setIsCreate] = useState(false);
    const [audioData, setAudioData] = useState([]);
    const [audioDuration, setAudioDuration] = useState('');
            const token = localStorage.getItem('access_token');

    const categories = [
        {value: 'vlog', label: 'Vlog'},
        {value: 'tourism', label: 'Tourism'},
        {value: 'love', label: 'Love'},
        {value: 'spring', label: 'Spring'},
        {value: 'beat', label: 'Beat'},
        {value: 'heal', label: 'Heal'},
        {value: 'warm', label: 'Warm'},
        {value: 'trend', label: 'Trend'},
        {value: 'revenue', label: 'Revenue'},
        {value: 'horrified', label: 'Horrified'},
        {value: 'laugh', label: 'Laugh'}
    ];

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

    const handleSwitch = () => {
        setIsCreate(!isCreate);
    };
    const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);

    const audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        console.log('Audio duration:', duration);
        setAudioDuration(duration);
    });
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!audioFile) {
            alert("Please upload an audio file");
            return;
        }

        try {
            const {data, error} = await supabase
                .storage
                .from('audio_files')
                .upload(`${category}/${audioFile.name}`, audioFile);

            if (error) {
                throw error;
            }

            const {data: publicURL} = supabase
                .storage
                .from('audio_files')
                .getPublicUrl(`${category}/${audioFile.name}`);

            if (!publicURL) {
                alert('Failed to get public URL');
                return;
            }

            const formData = new FormData();
            formData.append('audio_file', publicURL.publicUrl);
            formData.append('name', name);
            formData.append('artist', artist);
            formData.append('duration', audioDuration);
            formData.append('category', category);

            const response = await axios.post('http://localhost:8000/myapp/upload_audio/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                alert('File uploaded and saved successfully!');
            } else {
                alert('Failed to save audio details to database');
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
                            label="Audio Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Audio Artist"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
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
                            Upload Audio File
                            <input type="file" hidden onChange={handleFileChange} accept="audio/*"/>
                        </Button>
                        {audioFile && <p>File: {audioFile.name}</p>}
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '20px'}}>
                            Add Audio
                        </Button>
                    </form>
                    <button onClick={handleSwitch}>Cancle</button>
                </>
            ) : (
                <>
                    <h1>Audio manage</h1>
                    <button onClick={handleSwitch}>new</button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Artist</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Audio File</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Updated At</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {audioData.map((audio) => (
                                    <TableRow key={audio.id}>
                                        <TableCell>{audio.name}</TableCell>
                                        <TableCell>{audio.artist}</TableCell>
                                        <TableCell>{audio.category}</TableCell>
                                        <TableCell><a href={audio.audio_file}>File link</a></TableCell>
                                        <TableCell>{new Date(audio.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(audio.updated_at).toLocaleString()}</TableCell>
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

export default AudioManage;
