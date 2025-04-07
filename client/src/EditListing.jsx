import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditListing = () => {
    const { id } = useParams();  // Get the listing ID from the URL parameters
    const {title, setTitle} = useState('');
    const {description, setDescription} = useState('');
    const {price, setPrice} = useState('');
    const navigate = useNavigate();  // For navigation after editing

    useEffect(() => {
        // Fetch the listing details
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:3001/listings/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                const {title, description, price} = res.data;  // Destructure the response data
                setTitle(title);
                setDescription(description);
                setPrice(price);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
          await axios.put(`http://localhost:3001/listings/${id}`, {
            title,
            description,
            price,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          navigate('/my-listings'); // Redirect to the listings page
        } catch (err) {
          console.error(err);
        }
      };
    
      return (
        <div>
          <h1>Edit Listing</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>
      );
    };
    
    export default EditListing;