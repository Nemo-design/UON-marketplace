import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log('Fetching all listings...'); // Debug log
        const response = await axios.get('http://localhost:3001/listings/all');
        console.log('Response received:', response.data); // Debug log
        
        if (!response.data) {
          throw new Error('No data received');
        }

        setListings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError(error.message || 'Failed to fetch listings');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const createListing = () => {
    navigate('/upload');
  };

  const myAccount = () => {
    navigate('/account');
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading listings...</p>
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>University of Newcastle Community Marketplace</h1>
        <div className="btn-group">
          <button className="btn btn-primary me-2" onClick={createListing}>Create Listing</button>
          <button className="btn btn-info me-2" onClick={myAccount}>My Account</button>
          <button className="btn btn-danger" onClick={logOut}>Logout</button>
        </div>
      </div>

      {!listings || listings.length === 0 ? (
        <div className="alert alert-info">
          No listings found.
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
                  <h5 className="card-title">{listing.title}</h5>
                  <p className="card-text flex-grow-1">{listing.description}</p>
                  <div className="mt-auto">
                    <p className="card-text">
                      <strong className="text-primary">Price: ${listing.price}</strong>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">Category: {listing.category}</small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">Posted by: {listing.username}</small>
                    </p>
                    <button 
                      className="btn btn-outline-primary w-100"
                      onClick={() => navigate(`/send-message?recipient=${listing.username}`)}
                    >
                      Send Message
                    </button>
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

export default Dashboard;