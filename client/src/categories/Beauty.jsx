import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Beauty = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/listings/all');
        if (!response.data) {
          throw new Error('No data received');
        }

        const beautyListings = response.data.filter(
          listing => listing.category === 'Beauty'
        );
        setListings(beautyListings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching beauty listings:', error);
        setError('Failed to fetch beauty listings');
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
        <p className="mt-2">Loading beauty listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Beauty Products</h1>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {listings.map((listing) => (
          <div key={listing._id} className="col">
            <div className="card h-100 shadow-sm border-0">
              {listing.image && (
                <img
                  src={`data:image/jpeg;base64,${listing.image}`}
                  className="card-img-top"
                  alt={listing.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">{listing.title}</h5>
                <p className="card-text text-muted" style={{ flexGrow: 1 }}>
                  {listing.description}
                </p>
                <p className="card-text mb-1">
                  <strong>Price: ${listing.price}</strong>
                </p>
                <small className="text-muted">Posted by: {listing.username}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Beauty;
