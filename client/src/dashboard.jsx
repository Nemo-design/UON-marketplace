import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

function Dashboard() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredListings, setFilteredListings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:3001/listings/all');
                if (!response.data) {
                    throw new Error('No data received');
                }
                setListings(response.data);
                setFilteredListings(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching listings:', error);
                setError(error.message || 'Failed to fetch listings');
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = listings.filter(listing =>
            listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredListings(filtered);
    };

    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value === '') {
            setFilteredListings(listings);
        } else {
            const filtered = listings.filter(listing =>
                listing.title?.toLowerCase().includes(value.toLowerCase()) ||
                listing.description?.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredListings(filtered);
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
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">Home</Link>
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

                        <form className="d-flex mx-auto search-form" onSubmit={handleSearch}>
                            <input
                                className="form-control me-2 search-input"
                                type="search"
                                placeholder="Search listings..."
                                value={searchTerm}
                                onChange={handleSearchInput}
                                aria-label="Search"
                            />
                            <button className="btn search-btn" type="submit">
                                Search
                            </button>
                        </form>

                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex-grow-1 d-flex">
                <div className="category-sidebar bg-light p-3" style={{ width: '250px' }}>
                    <h5 className="mb-3">Categories</h5>
                    <ul className="list-unstyled">
                        {['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Vehicles', 'Toys', 'Home Appliances', 'Beauty', 'Pets'].map((category) => (
                            <li className="category-item" key={category}>
                                <Link to={`/category/${category.toLowerCase()}`} className="text-decoration-none">
                                    {category}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

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
                            {filteredListings.length > 0 ? (
                                filteredListings.map((listing) => (
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
                                                        onClick={() => navigate(`/send-message?recipient=${listing.username}&listingTitle=${encodeURIComponent(listing.title)}&listingPrice=${listing.price}`)}
                                                    >
                                                        Send Message
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center">
                                    <p>No listings found matching your search.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;