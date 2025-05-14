import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Upload.css';

function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); // State for the image file
  const [category, setCategory] = useState(''); // State for the category

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem('username'); // Get the username from local storage

    const formData = new FormData(); // Use FormData for file upload
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('username', username);
    formData.append('category', category); // Append the selected category
    if (image) {
      formData.append('image', image); // Append the image file
    }

    const token = localStorage.getItem('token');
    axios.post('http://localhost:3001/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set content type for file upload
        'Authorization': `Bearer ${token}`,
      },
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
    <div className="upload-container">
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
          <label htmlFor="Category">Category</label>
          <select
            id="Category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Sports">Sports</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Toys">Toys</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Beauty">Beauty</option>
            <option value="Pets">Pets</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="Image">Upload Image</label>
          <input
            type="file"
            id="Image"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])} // Set the selected file
          />
        </div>
        <div className="button-row">
          <button type="submit" className="upload-button">
            Upload
          </button>
          <button
              type="button"
              className="return-button"
              onClick={() => navigate('/dashboard')}
          >
            Return
          </button>
        </div>
      </form>
    </div>
  );
}

export default Upload;  