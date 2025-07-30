import {Button, MenuItem, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import {supabase} from "../../supabaseClient";
import axios from "axios";


const FilterEdit = ({onOptionSelect, filterId}) => {
    const [filterData, setFilterData] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [config, setConfig] = useState({});
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');


    const categories = [
        {value: 'featured', label: 'Featured'},
        {value: 'life', label: 'Life'},
        {value: 'scenery', label: 'Scenery'},
        {value: 'movies', label: 'Movies'},
        {value: 'retro', label: 'Retro'},
        {value: 'style', label: 'Style'}
    ];

    useEffect(() => {
        async function fetchFilterData() {
            try {
                const response = await axios.get(`http://localhost:8000/myapp/get_filter_by_id/${filterId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data) && response.data.length > 0) {
                    const filterItem = response.data[0];
                    setFilterData(filterItem);
                    setName(filterItem.name || '');
                    setCategory(filterItem.category || '');
                    setConfig(JSON.stringify(filterItem.config) || '');
                } else {
                    console.error('No filter data found for the given ID.');
                }
            } catch (error) {
                console.error('Error fetching filter data:', error);
            }
        }

        fetchFilterData();
    }, [filterId, token]);

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

        const random = uuidv4();
        let imagePublicURL = filterData.image;

        try {

            if (imageFile) {
                const {data: imageUploadData, error: imageUploadError} = await supabase
                    .storage
                    .from('filter_files')
                    .upload(`${filterData.category}/${random}_${imageFile.name}`, imageFile);

                if (imageUploadError) throw imageUploadError;

                const {data: imagePublicData} = supabase
                    .storage
                    .from('filter_files')
                    .getPublicUrl(`${filterData.category}/${random}_${imageFile.name}`);

                imagePublicURL = imagePublicData.publicUrl;
            }

            const formData = new FormData();
            formData.append('image', imagePublicURL);
            formData.append('name', name);
            formData.append('category', category);
            formData.append('config', config);

            const response = await axios.post(`http://localhost:8000/myapp/update_filter/${filterData.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {

                setDialogMessage('File update successful!');
                setDialogOpen(true);
                navigate('/admin/filter', {state: {onOptionSelectValue: 'filter'}});
            } else {

                setDialogMessage('Can not update file!');
                setDialogOpen(true);
            }
        } catch (error) {
            console.error('Error to update file:', error.message);

            setDialogMessage('Error to update file!');
            setDialogOpen(true);
        }
    };

    return (
        <>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                className="custom-dialog"
            >
                <DialogTitle>
                    Notification
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>OK</Button>
                </DialogActions>
            </Dialog>

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
                        Save Filter
                    </button>
                </div>
            </form>
        </>
    )
}

export default FilterEdit