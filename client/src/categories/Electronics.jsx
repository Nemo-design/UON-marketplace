import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Electronics = () => {
  const [listings, setListings] = useState([]); // State to store the listings
  const [error, setError] = useState(null); // State to store any errors
  const [loading, setLoading] = useState(true); // State to show loading indicator

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token for authentication
        console.log('Token:', token); // Debugging: Log the token

        // Fetch data from the backend
        const response = await axios.get('http://localhost:3001/listings/electronics', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the headers
          },
        });

        console.log('Response:', response.data); // Debugging: Log the response data
        setListings(response.data); // Set the fetched data to the state
      } catch (error) {
        console.error('Error fetching electronics listings:', error.response || error.message);
        setError('Failed to load electronics listings. Please try again later.');
      } finally {
        setLoading(false); // Stop the loading indicator
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Electronics Listings</h1>
      <p>Browse all the electronics available in the market.</p>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : listings.length > 0 ? (
        <ul>
          {listings.map((listing) => (
            <li key={listing._id} style={{ marginBottom: '20px' }}>
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p>Price: {listing.price}</p>
              <p>Posted by: {listing.username}</p>
              {listing.image && (
                <img
                  src={`data:image/jpeg;base64,${listing.image}`} // Render the image
                  alt={listing.title}
                  style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No listings found for Electronics.</p>
      )}
    </div>
  );
};

export default Electronics;