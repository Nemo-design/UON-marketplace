import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Pets = () => {
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
        const petListings = response.data.filter(
          listing => listing.category === 'Pets'
        );
        setListings(petListings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pet listings:', error);
        setError('Failed to fetch pet listings');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary mb-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="lead text-primary">Loading pet listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger shadow-sm">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4 text-center">
        <h1 className="display-5 fw-bold">Pet Listings</h1>
        <p className="lead text-muted">Find your perfect companion</p>
      </div>

      {!listings || listings.length === 0 ? (
        <div className="alert alert-info shadow-sm text-center">
          No pet listings found
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {listings.map((listing) => (
            <div key={listing._id} className="col">
              <div className="card h-100 shadow-sm border-0" style={{ maxWidth: '100%' }}>
                {listing.image && (
                  <div className="position-relative" style={{ height: '250px' }}>
                    <img
                      src={`data:image/jpeg;base64,${listing.image}`}
                      className="card-img-top"
                      alt={listing.title}
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                <div className="card-body d-flex flex-column p-3">
                  <h5 className="card-title text-truncate mb-2">{listing.title}</h5>
                  <p className="card-text text-muted" style={{ 
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    minHeight: '4.5rem'
                  }}>{listing.description}</p>
                  <div className="mt-auto pt-2 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="text-primary mb-0">${listing.price}</h5>
                      <span className="badge bg-secondary">Pet</span>
                    </div>
                    <p className="card-text mb-0">
                      <small className="text-muted">Posted by: {listing.username}</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pets;