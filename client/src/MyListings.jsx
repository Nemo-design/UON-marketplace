import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyListings = () => {
  const [listings, setListings] = useState([]);

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

  return (
    <div>
      <h1>My Listings</h1>
      <div>
        {listings.length > 0 ? (
          <ul>
            {listings.map((listing) => (
              <li key={listing._id}>
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
                <p>Price: {listing.price}</p>
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