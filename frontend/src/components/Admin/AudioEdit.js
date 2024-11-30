import React, {useEffect, useState} from 'react';
import {
    TextField,
    Button,
    MenuItem
} from '@mui/material'
import axios from 'axios';
import {supabase} from '../../supabaseClient';
import {v4 as uuidv4} from "uuid";
import {Link, useNavigate} from "react-router-dom";
import {FiEdit} from "react-icons/fi";

const AudioEdit = ({ onOptionSelect, audioId }) => {
    console.log('Audio Edit ID:', audioId);
    const [audioData, setAudioData] = useState([]);
    const [audioFile, setAudioFile] = useState(null);
    const token = localStorage.getItem('access_token');
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [artist, setArtist] = useState('');
    const [category, setCategory] = useState('');
    const [audioDuration, setAudioDuration] = useState('');
    const navigate = useNavigate();

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
                const response = await axios.get(`http://localhost:8000/myapp/get_audio_by_id/${audioId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data) && response.data.length > 0) {
                const audioItem = response.data[0];
                setAudioData(audioItem);
                setName(audioItem.name || '');
                setArtist(audioItem.artist || '');
                setCategory(audioItem.category || '');
                setAudioDuration(audioItem.duration || '');
            } else {
                console.error('No audio data found for the given ID.');
            }
            } catch (error) {
                console.error('Error fetching audio data:', error);
            }
        }

        fetchAudioData();
    }, [audioId, token]);

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

    const random = uuidv4();
    let audioPublicURL = audioData.audio_file;
    let imagePublicURL = audioData.image;

    try {
        if (audioFile) {
            const { data: audioUploadData, error: audioUploadError } = await supabase
                .storage
                .from('audio_files')
                .upload(`${audioData.category}/${random}_${audioFile.name}`, audioFile);

            if (audioUploadError) throw audioUploadError;

            const { data: audioPublicData } = supabase
                .storage
                .from('audio_files')
                .getPublicUrl(`${audioData.category}/${random}_${audioFile.name}`);

            audioPublicURL = audioPublicData.publicUrl;
        }
        console.log({audioPublicURL})

        if (imageFile) {
            const { data: imageUploadData, error: imageUploadError } = await supabase
                .storage
                .from('audio_files')
                .upload(`${audioData.category}/${random}_${imageFile.name}`, imageFile);

            if (imageUploadError) throw imageUploadError;

            const { data: imagePublicData } = supabase
                .storage
                .from('audio_files')
                .getPublicUrl(`${audioData.category}/${random}_${imageFile.name}`);

            imagePublicURL = imagePublicData.publicUrl;
        }

        const formData = new FormData();
        formData.append('audio_file', audioPublicURL);
        formData.append('image', imagePublicURL);
        formData.append('name', name);
        formData.append('artist', artist);
        formData.append('duration', audioDuration);
        formData.append('category', category);

        const response = await axios.post(`http://localhost:8000/myapp/update_audio/${audioData.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 201) {
            alert('File update successful!');
            navigate('/admin/audio', { state: { onOptionSelectValue: 'audio' } });
        } else {
            alert('Can not update file');
        }
    } catch (error) {
        console.error('Error to update file:', error.message);
        alert('Error to update file');
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
                {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Selected Image" width="100"/>
                ) : (
                    audioData.image && <img src={audioData.image} alt="Selected Image" width="100"/>
                )}
                {audioFile ? (
                    <p>File: {audioFile.name}</p>
                ) : (
                    <p>File: {audioData.audio_file}</p>
                )}
                <div className="action-create">
                    <button type="button" className="cancle-btn active-btn"><Link className="link" to="/admin/audio"
                                                                                  onClick={() => onOptionSelect('audio')}>
                        <span>Cancle</span></Link></button>
                    <button type="submit" className="add-new-btn active-btn">
                        Save Audio
                    </button>
                </div>
            </form>
    )
}

export default AudioEdit