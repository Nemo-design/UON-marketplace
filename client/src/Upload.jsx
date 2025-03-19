import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Upload() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        //const newItem = { title, description, price, image };
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);

        axios.post('http://localhost:3001/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })

          .then((res) => {
            console.log(res);
            navigate('/dashboard'); // Redirect to dashboard page
          })
          .catch((err) => {
            console.log(err);
          });
      };

    return (
        <div>
            <h1>Upload Page</h1>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="Title">Listing Title</label>
                <input
                    type="text"
                    id="Title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="Description">Description</label>
                <input
                    type="text"
                    id="Description"
                    name="description"
                    required
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="Price">Price</label>
                <input
                    type="text"
                    id="Price"
                    name="price"
                    required
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="Image">Image</label>
                <input
                type="file"
                accept=".png, .jpg, .jpeg"
                id="Image"
                name="image"
                required
                onChange={(e) => setImage(e.target.files[0])}
                />
            </div>
            }
            <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default Upload;