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
import {v4 as uuidv4} from "uuid";

const FilterManage = () => {
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [isCreate, setIsCreate] = useState(false);
    const [filterData, setFilterData] = useState([]);
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

    useEffect(() => {
        async function fetchFilterData() {
            try {
                const response = await axios.get('http://localhost:8000/myapp/get_all_filters/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFilterData(response.data);
            } catch (error) {
                console.error('Error fetching filter data:', error);
            }
        }

        fetchFilterData();
    }, []);

    const handleSwitch = () => {
        setIsCreate(!isCreate);
    };

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
        <>
            {isCreate ? (
                <>
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
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '20px'}}>
                            Add Filter
                        </Button>
                    </form>
                    <button onClick={handleSwitch}>Cancle</button>
                </>
            ) : (
                <>
                    <h1>Filter manage</h1>
                    <button onClick={handleSwitch}>new</button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Updated At</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filterData.map((filter) => (
                                    <TableRow key={filter.id}>
                                        <TableCell><img src={filter.image}/></TableCell>
                                        <TableCell>{filter.name}</TableCell>
                                        <TableCell>{filter.category}</TableCell>
                                        <TableCell>{new Date(filter.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(filter.updated_at).toLocaleString()}</TableCell>
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

export default FilterManage;
