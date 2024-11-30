import {Button, MenuItem, TextField} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {supabase} from "../../supabaseClient";
import axios from "axios";

const TextEdit = ({ onOptionSelect, textId }) => {
    const [textData, setTextData] = useState([]);
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
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTextData() {
            try {
                const response = await axios.get(`http://localhost:8000/myapp/get_text_by_id/${textId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data) && response.data.length > 0) {
                const textItem = response.data[0];
                setTextData(textItem);
                setName(textItem.name || '');
                setContent(textItem.content || '');
                setCategory(textItem.category || '');
                setStyle(JSON.stringify(textItem.style) || '');

            } else {
                console.error('No text data found for the given ID.');
            }
            } catch (error) {
                console.error('Error fetching text data:', error);
            }
        }


        console.log({style})
        fetchTextData();
    }, [textId, token]);

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

    const random = uuidv4();
    let imagePublicURL = textData.image;

    try {
        if (imageFile) {
            const { data: imageUploadData, error: imageUploadError } = await supabase
                .storage
                .from('text_files')
                .upload(`${textData.category}/${random}_${imageFile.name}`, imageFile);

            if (imageUploadError) throw imageUploadError;

            const { data: imagePublicData } = supabase
                .storage
                .from('text_files')
                .getPublicUrl(`${textData.category}/${random}_${imageFile.name}`);

            imagePublicURL = imagePublicData.publicUrl;
        }

        const formData = new FormData();
        formData.append('image', imagePublicURL);
        formData.append('name', name);
            formData.append('content', content);
            formData.append('category', category);
            formData.append('style', style);


            console.log({name})
            console.log({content})
            console.log({category})
            console.log({style})


        const response = await axios.post(`http://localhost:8000/myapp/update_text/${textData.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 201) {
            alert('File update successful!');
            navigate('/admin/text', { state: { onOptionSelectValue: 'text' } });
        } else {
            alert(`Can not update file`);
        }
    } catch (error) {
        console.error('Error to update file:', error.message);
        alert('Error to update file');
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

export default TextEdit