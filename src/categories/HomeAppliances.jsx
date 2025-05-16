import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomeAppliances = () => {
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
        // Filter for Home Appliances category
        const homeApplianceListings = response.data.filter(
          listing => listing.category === 'Home Appliances'
        );
        setListings(homeApplianceListings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to fetch home appliance listings');
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
        <p className="lead text-primary">Loading home appliance listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger shadow-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4 text-center">
        <h1 className="display-5 fw-bold">Home Appliances</h1>
        <p className="lead text-muted">Find great deals on home appliances</p>
      </div>

      {!listings || listings.length === 0 ? (
        <div className="alert alert-info shadow-sm text-center">
          No home appliance listings found
        </div>
      ) : (
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
                  <h5 className="card-title mb-3">{listing.title}</h5>
                  <p className="card-text text-muted mb-3">{listing.description}</p>
                  <div className="mt-auto">
                    <h4 className="text-primary mb-2">${listing.price}</h4>
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

export default HomeAppliances;