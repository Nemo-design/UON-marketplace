import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch only the logged-in user's listings from the backend
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/my-listings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setListings(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-listing/${id}`); // Redirect to the edit listing page
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setListings(listings.filter((listing) => listing._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const createListing = () => {
    navigate('/upload');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>My Listings</h1>
      <button onClick={goToDashboard}>Home</button>
      <button onClick={createListing}>Create Listing</button>
      <div>
        {listings.length > 0 ? (
          <ul>
            {listings.map((listing) => (
              <li key={listing._id}>
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
                <p>Price: {listing.price}</p>
                {listing.image && (
                  <img
                    src={`data:image/jpeg;base64,${listing.image}`} // Render Base64 image
                    alt="listing"
                    style={{ width: '200px', height: 'auto' }}
                  />
                )}
                <button onClick={() => handleEdit(listing._id)}>Edit</button>
                <button onClick={() => handleDelete(listing._id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No listings found.</p>
        )}
      </div>
    </div>
  );
};

export default MyListings;