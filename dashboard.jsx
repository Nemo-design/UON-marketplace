import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredListings, setFilteredListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch listings from the backend
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/listings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setListings(res.data);
        setFilteredListings(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const handleSearch = (e) => {
    e.preventDefault();
    const searchResults = listings.filter(listing =>
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredListings(searchResults);
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredListings(listings);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Market</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            </ul>
            
            <form className="d-flex mx-auto search-form" onSubmit={handleSearch}>
              <input 
                className="form-control me-2 search-input" 
                type="search" 
                placeholder="Search" 
                value={searchTerm}
                onChange={handleSearchInput}
              />
              <button className="btn search-btn" type="submit">Search</button>
            </form>

            <div className="d-flex gap-2 ms-auto">
              <button onClick={logOut} className="btn btn-outline-danger btn-sm">Logout</button>
              <button onClick={createListing} className="btn btn-outline-primary btn-sm">Create</button>
              <button onClick={myAccount} className="btn btn-outline-secondary btn-sm">My Account</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow-1 d-flex">
        <div className="category-sidebar bg-light p-3" style={{ width: '250px' }}>
          <h5 className="mb-3">Categories</h5>
          <ul className="list-unstyled">
            {['Electronics','Furniture','Clothing','Books','Sports','Vehicles','Toys','Home Appliances','Beauty','Pets'].map((cat, idx) => (
              <li className="category-item" key={idx}>
                <Link to={`/category/${cat.toLowerCase().replace(" ", "-")}`} className="text-decoration-none">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="container mt-4">
          <h1 className="mb-4 text-center">University of Newcastle Community Marketplace</h1>
          <div>
            <h2 className="mb-4">Listings</h2>
            {filteredListings.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredListings.map((listing) => (
                  <div className="col" key={listing._id}>
                    <div className="card listing-card h-100">
                      {listing.image && (
                        <img src={listing.image} className="card-img-top listing-image" alt="listing" />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{listing.title}</h5>
                        <p className="card-text">{listing.description}</p>
                        <p className="card-text"><strong>Price:</strong> {listing.price}</p>
                        <p className="card-text"><small>Seller: {listing.username}</small></p>
                        <button
                          onClick={() => navigate(`/send-message?recipient=${listing.username}`)}
                          className="btn btn-sm btn-outline-primary mt-auto"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No listings found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;