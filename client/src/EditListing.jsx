import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Upload.css';

function EditListing() {
    const { id } = useParams(); // Get the listing ID from the URL parameters
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null); // State for the new image file
    const [currentImage, setCurrentImage] = useState(''); // State for the current image

    const navigate = useNavigate(); // For navigation after editing

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        if (image) {
            formData.append('image', image); // Append the new image file if provided
        }

        const token = localStorage.getItem('token');
        axios.put(`http://localhost:3001/listings/id/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Set content type for file upload
            },
        })
            .then((res) => {
                console.log(res.data); // Log the response data
                navigate('/my-listings'); // Redirect to the listings page
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        // Fetch the listing details
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:3001/listings/id/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                const { title, description, price, image } = res.data; // Destructure the response data
                setTitle(title);
                setDescription(description);
                setPrice(price);
                setCurrentImage(image); // Set the current image
            })
            .catch((err) => {
                console.error("Error fetching listing", err); // Log any errors
            });
    }, [id]);

    return (
        <div className='upload-container'>
            <h1>Edit Listing</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="Title">Title</label>
                    <input
                        type="text"
                        id="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Description">Description</label>
                    <input
                        type="text"
                        id="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Price">Price</label>
                    <input
                        type="text"
                        id="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="CurrentImage">Current Image</label>
                    {currentImage && (
                        <img
                            src={`data:image/jpeg;base64,${currentImage}`} // Render the current Base64 image
                            alt="Current Listing"
                            style={{ width: '200px', height: 'auto' }}
                        />
                    )}
                </div>
                
                <div className="form-group">
                    <label htmlFor="NewImage">Upload New Image</label>
                    <input
                        id="NewImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])} // Set the new image file
                    />
                </div>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate('/my-listings')}>Cancel</button>
            </form>
        </div>
    );
}

export default EditListing;