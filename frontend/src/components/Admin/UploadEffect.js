import React, { useState } from 'react';
import axios from 'axios';

const AudioUploadForm = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [category, setCategory] = useState('vlog');

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!audioFile) {
    alert('Please select an audio file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('audio_file', audioFile);
  formData.append('name', name);
  formData.append('artist', artist);
  formData.append('category', category);

  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post('http://localhost:8000/myapp/upload_audio/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('Audio uploaded successfully:', response.data);
    alert('Audio uploaded successfully!');
  } catch (error) {
    console.error('Error uploading audio:', error);
    alert('Failed to upload audio');
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="audioFile">Choose Audio File:</label>
        <input type="file" id="audioFile" accept="audio/*" onChange={handleFileChange} required />
      </div>
      <div>
        <label htmlFor="name">Audio Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for the audio"
        />
      </div>
      <div>
        <label htmlFor="artist">Artist:</label>
        <input
          type="text"
          id="artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Enter artist name"
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="vlog">Vlog</option>
          <option value="tourism">Tourism</option>
          <option value="love">Love</option>
          <option value="spring">Spring</option>
          <option value="beat">Beat</option>
          <option value="heal">Heal</option>
          <option value="warm">Warm</option>
        </select>
      </div>
      <button type="submit">Upload Audio</button>
    </form>
  );
};

export default AudioUploadForm;
