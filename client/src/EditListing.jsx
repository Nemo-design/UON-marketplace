import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditListing.css';

function EditListing() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [currentImages, setCurrentImages] = useState([]); // Array of base64 images
    const [images, setImages] = useState([]); // New images to upload
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        if (images && images.length > 0) {
            images.forEach(img => formData.append('images', img));
        }

        const token = localStorage.getItem('token');
        axios.put(`http://localhost:3001/listings/id/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                navigate('/my-listings');
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // Delete current image from server
    const handleDeleteImage = async (index) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(
                `http://localhost:3001/listings/id/${id}/image/${index}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            setCurrentImages((prevImages) => {
                const updated = prevImages.filter((_, i) => i !== index);
                // Adjust currentImageIndex if needed
                if (currentImageIndex >= updated.length && updated.length > 0) {
                    setCurrentImageIndex(updated.length - 1);
                }
                return updated;
            });
        } catch (err) {
            console.error('Error deleting image:', err);
        }
    };

    // Delete new image from preview (not from server)
    const handleDeleteNewImage = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handlePrev = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? currentImages.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) =>
            prev === currentImages.length - 1 ? 0 : prev + 1
        );
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:3001/listings/id/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                const { title, description, price, images } = res.data;
                setTitle(title);
                setDescription(description);
                setPrice(price);
                setCurrentImages(images || []);
            })
            .catch((err) => {
                console.error("Error fetching listing", err);
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
                    <label htmlFor="CurrentImage">Current Images</label>
                    {currentImages && currentImages.length > 0 && (
                        <div className="carousel-container">
                            <button
                                type="button"
                                className="carousel-arrow left"
                                onClick={handlePrev}
                                disabled={currentImages.length <= 1}
                            >
                                &#60;
                            </button>
                            <img
                                src={`data:image/jpeg;base64,${currentImages[currentImageIndex]}`}
                                alt={`Listing ${currentImageIndex + 1}`}
                                className="carousel-image"
                            />
                            <button
                                type="button"
                                className="carousel-arrow right"
                                onClick={handleNext}
                                disabled={currentImages.length <= 1}
                            >
                                &#62;
                            </button>
                            <button
                                type="button"
                                className="carousel-delete"
                                onClick={() => {
                                    handleDeleteImage(currentImageIndex);
                                    handleNext();
                                }}
                                title="Delete this image"
                            >
                                &times;
                            </button>
                            <span className="carousel-counter">
                                {currentImageIndex + 1} / {currentImages.length}
                            </span>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="NewImages">Add New Images</label>
                    <input
                        type="file"
                        id="NewImages"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={e => setImages(Array.from(e.target.files))}
                    />
                </div>
                {images && images.length > 0 && (
                    <div style={{ display: 'flex', gap: 10, margin: '10px 0' }}>
                        {images.map((img, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt={`preview-${idx}`}
                                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteNewImage(idx)}
                                    title="Remove this image"
                                    className='preview-delete'
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate('/my-listings')}>Cancel</button>
            </form>
        </div>
    );
}

export default EditListing;