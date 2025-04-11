import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Furniture = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log('Fetching furniture listings...'); // Debug log
        const response = await axios.get('http://localhost:3001/listings/furniture');
        console.log('Response received:', response.data); // Debug log
        
        if (!response.data) {
          throw new Error('No data received');
        }

        setListings(response.data.filter(listing => listing.category === 'Furniture'));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching furniture listings:', error);
        setError(error.message || 'Failed to fetch furniture listings');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading furniture listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">
          No furniture listings found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Furniture Listings</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {listings.map((listing) => (
          <div key={listing._id} className="col">
            <div className="card h-100 shadow-sm">
              {listing.image && (
                <img
                  src={`data:image/jpeg;base64,${listing.image}`}
                  className="card-img-top"
                  alt={listing.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{listing.title}</h5>
                <p className="card-text flex-grow-1">{listing.description}</p>
                <div className="mt-auto">
                  <p className="card-text">
                    <strong className="text-primary">Price: ${listing.price}</strong>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Posted by: {listing.username}</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Furniture;