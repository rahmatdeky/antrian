import React, { useState } from 'react';
import axiosClient from '../axios-client';
const CreatePost = () => {
    const [formData, setFormData] = useState({
        nama: '',
        nomor: '',
    });
    
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('/notif/store', formData);
            setSuccessMessage(response.data.success);
            setErrors([]);  // Clear errors if the submission is successful
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);  // Set validation errors
            }
        }
    };

    return (
        <div className="container mt-5">
            <h1>Create a New Post</h1>

            {/* Display success message if available */}
            {successMessage && (
                <div className="alert alert-success">
                    {successMessage}
                </div>
            )}

            {/* Display validation errors if any */}
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    <ul>
                        {Object.keys(errors).map((key) => (
                            <li key={key}>{errors[key]}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nama">Nama:</label>
                    <input
                        type="text"
                        id="nama"
                        name="nama"
                        className="form-control"
                        value={formData.nama}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="nomor">Nomor:</label>
                    <input
                        type="text"
                        id="nomor"
                        name="nomor"
                        className="form-control"
                        value={formData.nomor}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
