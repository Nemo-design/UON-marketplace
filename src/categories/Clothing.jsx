import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Clothing = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/listings/clothing');
        if (!response.data) {
          throw new Error('No data received');
        }
        setListings(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch clothing listings');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <header className="mb-5 text-center">
        <h2 className="display-5 fw-bold">Clothing Items</h2>
        <p className="text-muted">Browse available clothing listings</p>
      </header>

      {!listings || listings.length === 0 ? (
        <div className="text-center">
          <p>No clothing listings available.</p>
        </div>
      ) : (
        <div className="row g-4">
          {listings.map((listing) => (
            <div key={listing._id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                {listing.image && (
                  <div className="position-relative">
                    <img
                      src={`data:image/jpeg;base64,${listing.image}`}
                      alt={listing.title}
                      className="card-img-top"
                      style={{
                        height: '250px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-3">{listing.title}</h5>
                  <p className="card-text text-muted mb-3">{listing.description}</p>
                  <div className="mt-auto">
                    <h4 className="mb-3 text-primary">${listing.price}</h4>
                    <p className="card-text">
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

export default Clothing;