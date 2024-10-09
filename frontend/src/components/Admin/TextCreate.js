import {Button, MenuItem, TextField} from "@mui/material";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import {v4 as uuidv4} from "uuid";
import {supabase} from "../../supabaseClient";
import axios from "axios";

const TextCreate = ({ onOptionSelect }) => {
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [style, setStyle] = useState({});
            const token = localStorage.getItem('access_token');

    const categories = [
        { value: 'default', label: 'Default' },
{ value: 'trending', label: 'Trending' },
{ value: 'basic', label: 'Basic' },
{ value: 'multicolor', label: 'Multicolor' }
    ];

    function handleJsonChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const fileContent = event.target.result;
        setStyle(fileContent);
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
                .from('text_files')
                .upload(`${category}/${random}_${imageFile.name}`, imageFile);

            if (imageUploadError) throw imageUploadError;

            const {data: imagePublicURL} = supabase
                .storage
                .from('text_files')
                .getPublicUrl(`${category}/${random}_${imageFile.name}`);

            const formData = new FormData();
            formData.append('image', imagePublicURL.publicUrl);
            formData.append('name', name);
            formData.append('content', content);
            formData.append('category', category);
            formData.append('style', style);


            const response = await axios.post('http://localhost:8000/myapp/upload_text/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                alert('File uploaded and saved successfully!');
            } else {
                alert('Failed to save text details to database');
            }

        } catch (error) {
            console.error('Error uploading file:', error.message);
            alert('Error uploading file');
        }
    };
    return (
        <form onSubmit={handleSubmit} style={{maxWidth: '400px', margin: '0 auto'}}>
            <TextField
                label="Text Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <TextField
                label="Text Content"
                variant="outlined"
                fullWidth
                margin="normal"
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
                <button type="button" className="cancle-btn active-btn"><Link className="link"
                                                                              to="/admin/text"
                                                                              onClick={() => onOptionSelect('text')}>
                    <span>Cancle</span></Link></button>
                <button type="submit" className="add-new-btn active-btn">
                    Save Text
                </button>
            </div>
        </form>
    )
}
export default TextCreate