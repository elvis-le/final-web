import React, {useState} from 'react';
import {TextField, Button, MenuItem} from '@mui/material';
import {supabase} from '../../supabaseClient';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import {Link} from "react-router-dom";

const AudioCreate = ({onOptionSelect}) => {
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [artist, setArtist] = useState('');
    const [category, setCategory] = useState('');
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!audioFile) {
            alert("Please upload an audio file");
            return;
        }

        try {
            const random = uuidv4();
            const {data: audioUploadData, error: audioUploadError} = await supabase
                .storage
                .from('audio_files')
                .upload(`${category}/${random}_${audioFile.name}`, audioFile);

            if (audioUploadError) throw audioUploadError;

            const {data: audioPublicURL} = supabase
                .storage
                .from('audio_files')
                .getPublicUrl(`${category}/${random}_${audioFile.name}`);

            if (!audioPublicURL) throw new Error('Failed to get public audio URL');

            const {data: imageUploadData, error: imageUploadError} = await supabase
                .storage
                .from('audio_files')
                .upload(`${category}/${random}_${imageFile.name}`, imageFile);

            if (imageUploadError) throw imageUploadError;

            const {data: imagePublicURL} = supabase
                .storage
                .from('audio_files')
                .getPublicUrl(`${category}/${random}_${imageFile.name}`);


            console.log('Request Payload:', {
                audioPublicURL: audioPublicURL.publicUrl,
                imagePublicURL: imagePublicURL.publicUrl,
                name,
                artist,
                audioDuration,
                category,
            });


            const formData = new FormData();
            formData.append('audio_file', audioPublicURL.publicUrl);
            formData.append('image', imagePublicURL.publicUrl);
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
                    Upload Image File
                    <input type="file" hidden onChange={handleImageChange} accept="image/*"/>
                </Button>
                <Button variant="contained" component="label" fullWidth style={{marginTop: '15px'}}>
                    Upload Audio File
                    <input type="file" hidden onChange={handleFileChange} accept="audio/*"/>
                </Button>
                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Selected Image" width="100"/>}
                {audioFile && <p>File: {audioFile.name}</p>}
                <div className="action-create">
                    <button type="button" className="cancle-btn active-btn"><Link className="link" to="/admin/audio"
                                                                                  onClick={() => onOptionSelect('audio')}>
                        <span>Cancle</span></Link></button>
                    <button type="submit" className="add-new-btn active-btn">
                        Add Audio
                    </button>
                </div>
            </form>
    );
};

export default AudioCreate;
