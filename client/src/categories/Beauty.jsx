import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Beauty = () => {
  const [listings, setListings] = useState([]); // State to store the listings

  useEffect(() => {
    // Fetch data for the Beauty category from the backend
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token for authentication
        const response = await axios.get('http://localhost:3001/listings?category=Beauty', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the headers
          },
        });
        setListings(response.data); // Set the fetched data to the state
      } catch (error) {
        console.error('Error fetching beauty listings:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Beauty</h1>
      <p>Explore the latest beauty products available in the market.</p>
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
                    src={`data:image/jpeg;base64,${listing.image}`} // Render the image
                    alt={listing.title}
                    style={{ width: '200px', height: 'auto' }}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No listings found for Beauty.</p>
        )}
      </div>
    </div>
  );
};

export default Beauty;