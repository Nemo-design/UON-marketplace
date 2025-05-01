import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

function Dashboard() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:3001/listings/all');
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

     // Logout function
     const handleLogout = () => {
      localStorage.removeItem('token'); // Remove the token from localStorage
      localStorage.removeItem('username'); // Optional: Remove username if stored
      navigate('/login'); // Redirect to the login page
  };

    return (
        <div className="min-vh-100 d-flex flex-column">
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Market</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Sign Up</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/upload">Create Listing</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-messages">Messages</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-listings">My Listings</Link>
                            </li>
                        </ul>

                        {/* Logout Button */}
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>

                        {/* Search Bar */}
                        <form className="d-flex mx-auto search-form" role="search">
                            <input
                                className="form-control me-2 search-input"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                            <button className="btn search-btn" type="submit">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex">
                {/* Categories Sidebar */}
                <div className="category-sidebar bg-light p-3" style={{ width: '250px' }}>
                    <h5 className="mb-3">Categories</h5>
                    <ul className="list-unstyled">
                        <li className="category-item">
                            <Link to="/category/electronics" className="text-decoration-none">
                                Electronics
                            </Link>
                        </li>
                        <li className="category-item">
                            <Link to="/category/furniture" className="text-decoration-none">
                                Furniture
                            </Link>
                        </li>
                        <li className="category-item">
                            <Link to="/category/clothing" className="text-decoration-none">
                                Clothing
                            </Link>
                        </li>
                        <li className="category-item">
                            <Link to="/category/books" className="text-decoration-none">
                                Books
                            </Link>
                        </li>
                        <li className="category-item">
                            <Link to="/category/sports" className="text-decoration-none">
                                Sports
                            </Link>
                        </li>
                        <li className="category-item">
                            <Link to="/category/vehicles" className="text-decoration-none">
                                Vehicles
                            </Link>
                        </li>
                        <li className="category-item">
                            <Link to="/category/toys" className="text-decoration-none">
                                Toys
                            </Link>
                        </li>
                        <li className="category-item">
                            <Link to="/category/home-appliances" className="text-decoration-none">
                                Home Appliances
                            </Link>
                        </li>
                        <li className="category-item">
                            <Link to="/category/beauty" className="text-decoration-none">
                                Beauty
                            </Link>
                        </li>
                        <li className="category-item">
                            <Link to="/category/pets" className="text-decoration-none">
                                Pets
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Listings Section */}
                <div className="flex-grow-1 container mt-4">
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading listings...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            Error: {error}
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
                                                    <small className="text-muted">Posted by: {listing.username}</small>
                                                </p>
                                                <button
                                                    className="btn btn-outline-primary w-100"
                                                    onClick={() => navigate(`/send-message?recipient=${listing.username}`)} // Navigate to send-message
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
            </div>
        </div>
    );
}

export default Dashboard;