import {Button, MenuItem, TextField} from "@mui/material";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import {supabase} from "../../supabaseClient";
import axios from "axios";

const FilterCreate = ({ onOptionSelect }) => {
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [config, setConfig] = useState({});
    const token = localStorage.getItem('access_token');

    const categories = [
        { value: 'featured', label: 'Featured' },
{ value: 'life', label: 'Life' },
{ value: 'scenery', label: 'Scenery' },
{ value: 'movies', label: 'Movies' },
{ value: 'retro', label: 'Retro' },
{ value: 'style', label: 'Style' }
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

    const { data: imageUploadData, error: imageUploadError } = await supabase
        .storage
        .from('filter_files')
        .upload(`${category}/${random}_${imageFile.name}`, imageFile);

    if (imageUploadError) throw imageUploadError;

    const { data: imagePublicURL } = supabase
        .storage
        .from('filter_files')
        .getPublicUrl(`${category}/${random}_${imageFile.name}`);

    if (!imagePublicURL) throw new Error('Failed to get public image URL');

    const formData = new FormData();
    formData.append('image', imagePublicURL.publicUrl);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('config', config);

    const response = await axios.post('http://localhost:8000/myapp/upload_filter/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 201) {
        alert('Files uploaded and saved successfully!');
    } else {
        alert('Failed to save filter and image details to database');
    }

} catch (error) {
    console.error('Error uploading files:', error.message);
    alert('Error uploading files');
}

    };

    return (
            <form onSubmit={handleSubmit} style={{maxWidth: '400px', margin: '0 auto'}}>
                <TextField
                    label="Filter Name"
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
                    <button type="button" className="cancle-btn active-btn"><Link className="link" to="/admin/filter"
                                                                                  onClick={() => onOptionSelect('filter')}>
                        <span>Cancle</span></Link></button>
                    <button type="submit" className="add-new-btn active-btn">
                        Add Filter
                    </button>
                </div>
                <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '20px'}}>
                    Add Filter
                </Button>
            </form>
    );
};

export default FilterCreate