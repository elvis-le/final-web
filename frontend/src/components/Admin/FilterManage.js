import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {FiEdit, FiPlusCircle, FiTrash2} from "react-icons/fi";
import {confirmAlert} from "react-confirm-alert";
import {Link} from "react-router-dom";

const FilterManage = ({onOptionSelect}) => {
    const [filterData, setFilterData] = useState([]);
    const token = localStorage.getItem('access_token');


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

    const handleDelete = async (filterId) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this audio?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axios.post(`http://localhost:8000/myapp/delete_filter/`, {
                                filterId: filterId,                              }, {
                                headers: {
                                    Authorization: `Bearer ${token}`,                                  },
                            });
                            if (response.status === 201) {
                                setFilterData(filterData.filter(filter => filter.id !== filterId));
                                alert('File đã được xoá thành công!');
                            } else {
                                alert('Không thể xoá file');
                            }
                        } catch (error) {
                            console.error('Error deleting audio:', error);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => console.log('Delete canceled')
                }
            ]
        });
    };


    return (
        <>
            <h1 className="content-heading">Filter manage</h1>
            <button className="create-new active-btn"><Link className="link link-create"
                                                            to="/admin/filter/create-filter"
                                                            onClick={() => onOptionSelect('createFilter')}><FiPlusCircle
                className="icon"/>
                <span>New</span></Link></button>
            <table className="table-filter-wrap table-display-data-wrap">
                <thead className="table-filter-head table-display-data-head">
                <tr className="table-filter-head-row table-display-data-head-row">
                    <th className="table-filter-head-cell table-display-data-head-cell" style={{width: "15%"}}>Image</th>
                    <th className="table-filter-head-cell table-display-data-head-cell" style={{width: "15%"}}>Name</th>
                    <th className="table-filter-head-cell table-display-data-head-cell" style={{width: "15%"}}>Category</th>
                    <th className="table-filter-head-cell table-display-data-head-cell" style={{width: "20%"}}>Created At</th>
                    <th className="table-filter-head-cell table-display-data-head-cell" style={{width: "20%"}}>Updated At</th>
                    <th className="table-filter-head-cell table-display-data-head-cell" style={{width: "20%"}}>Action</th>
                </tr>
                </thead>
                <tbody className="table-filter-body table-display-data-wrap-body">
                {filterData.map((filter) => (
                    <tr key={filter.id} className="table-filter-body-row table-display-data-body-row">
                        <td className="table-filter-body-cell table-display-data-body-cell" style={{width: "15%", textAlign: "center"}}>
                            <img src={filter.image} alt={filter.name}/>
                        </td>
                        <td className="table-filter-body-cell table-display-data-body-cell" style={{width: "15%"}}>{filter.name}</td>
                        <td className="table-filter-body-cell table-display-data-body-cell" style={{width: "15%"}}>{filter.category}</td>
                        <td className="table-filter-body-cell table-display-data-body-cell" style={{width: "20%", textAlign: "center"}}>
                            {new Date(filter.created_at).toLocaleString()}
                        </td>
                        <td className="table-filter-body-cell table-display-data-body-cell" style={{width: "20%", textAlign: "center"}}>
                            {new Date(filter.updated_at).toLocaleString()}
                        </td>
                        <td className="table-filter-body-cell table-display-data-body-cell" style={{width: "20%"}}>
                            <div className="action-btn-wrap">
                                <button className="pushable edit-btn">
                                    <span className="shadow"></span>
                                    <span className="edge"></span>
                                    <Link className="link" to={`/admin/filter/edit/${filter.id}`}
                                       onClick={() => onOptionSelect('editFilter')}>
                                        <span className="front"><FiEdit className="icon"/> Edit</span>
                                    </Link>
                                </button>
                                <button className="pushable delete-btn" onClick={() => handleDelete(filter.id)}>
                                    <span className="shadow"></span>
                                    <span className="edge"></span>
                                    <span className="front"><FiTrash2 className="icon"/> Delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </>
    );
};

export default FilterManage;
