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

const TextManage = () => {
    const [textFile, setTextFile] = useState(null);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('');
    const [strokeColor, setStrokeColor] = useState('');
    const [category, setCategory] = useState('');
    const [isCreate, setIsCreate] = useState(false);
    const [textData, setTextData] = useState([]);
            const token = localStorage.getItem('access_token');

    const categories = [
        { value: 'default', label: 'Default' },
{ value: 'trending', label: 'Trending' },
{ value: 'pro', label: 'Pro' },
{ value: 'basic', label: 'Basic' },
{ value: 'multicolor', label: 'Multicolor' }
    ];

    useEffect(() => {
        async function fetchTextData() {
            try {
                const response = await axios.get('http://localhost:8000/myapp/get_all_texts/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTextData(response.data);
            } catch (error) {
                console.error('Error fetching text data:', error);
            }
        }

        fetchTextData();
    }, []);

    const handleSwitch = () => {
        setIsCreate(!isCreate);
    };
    const handleFileChange = (e) => {
        setTextFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!textFile) {
            alert("Please upload an text file");
            return;
        }

        try {
            const {data, error} = await supabase
                .storage
                .from('text_files')
                .upload(`${category}/${textFile.name}`, textFile);

            if (error) {
                throw error;
            }

            const {data: publicURL} = supabase
                .storage
                .from('text_files')
                .getPublicUrl(`${category}/${textFile.name}`);

            if (!publicURL) {
                alert('Failed to get public URL');
                return;
            }

            const formData = new FormData();
            formData.append('text_file', publicURL.publicUrl);
            formData.append('content', content);
            formData.append('color', color);
            formData.append('stroke_color', strokeColor);
            formData.append('category', category);


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
        <>
            {isCreate ? (
                <>
                    <form onSubmit={handleSubmit} style={{maxWidth: '400px', margin: '0 auto'}}>
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
                            label="Text Color"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            required
                        />
                        <TextField
                            label="Text Stroke Color"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={strokeColor}
                            onChange={(e) => setStrokeColor(e.target.value)}
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
                            Upload Text File
                            <input type="file" hidden onChange={handleFileChange} accept="text/*"/>
                        </Button>
                        {textFile && <p>File: {textFile.name}</p>}
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '20px'}}>
                            Add Text
                        </Button>
                    </form>
                    <button onClick={handleSwitch}>Cancle</button>
                </>
            ) : (
                <>
                    <h1>Text manage</h1>
                    <button onClick={handleSwitch}>new</button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Content</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Text File</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Updated At</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {textData.map((text) => (
                                    <TableRow key={text.id}>
                                        <TableCell>{text.content}</TableCell>
                                        <TableCell>{text.category}</TableCell>
                                        <TableCell><a href={text.text_file}>File link</a></TableCell>
                                        <TableCell>{new Date(text.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(text.updated_at).toLocaleString()}</TableCell>
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

export default TextManage;
