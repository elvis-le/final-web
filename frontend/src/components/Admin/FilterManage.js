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

const FilterManage = () => {
    const [filterFile, setFilterFile] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [isCreate, setIsCreate] = useState(false);
    const [filterData, setFilterData] = useState([]);
            const token = localStorage.getItem('access_token');

    const categories = [
        { value: 'featured', label: 'Featured' },
{ value: 'pro', label: 'Pro' },
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
    const handleFileChange = (e) => {
        setFilterFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!filterFile) {
            alert("Please upload an filter file");
            return;
        }

        try {
            const {data, error} = await supabase
                .storage
                .from('filter_files')
                .upload(`${category}/${filterFile.name}`, filterFile);

            if (error) {
                throw error;
            }

            const {data: publicURL} = supabase
                .storage
                .from('filter_files')
                .getPublicUrl(`${category}/${filterFile.name}`);

            if (!publicURL) {
                alert('Failed to get public URL');
                return;
            }

            const formData = new FormData();
            formData.append('filter_file', publicURL.publicUrl);
            formData.append('name', name);
            formData.append('category', category);


            const response = await axios.post('http://localhost:8000/myapp/upload_filter/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                alert('File uploaded and saved successfully!');
            } else {
                alert('Failed to save filter details to database');
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
                            Upload Filter File
                            <input type="file" hidden onChange={handleFileChange} accept="filter/*"/>
                        </Button>
                        {filterFile && <p>File: {filterFile.name}</p>}
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
                                    <TableCell>Name</TableCell>
                                    <TableCell>Artist</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Filter File</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Updated At</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filterData.map((filter) => (
                                    <TableRow key={filter.id}>
                                        <TableCell>{filter.name}</TableCell>
                                        <TableCell>{filter.artist}</TableCell>
                                        <TableCell>{filter.category}</TableCell>
                                        <TableCell><a href={filter.filter_file}>File link</a></TableCell>
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
