import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import {
    FaLaptop, FaCouch, FaTshirt, FaBook,
    FaBasketballBall, FaCar, FaPuzzlePiece,
    FaBlender, FaHeart, FaDog, FaThLarge
} from 'react-icons/fa';

function Dashboard() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredListings, setFilteredListings] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();

    const categories = [
        { name: 'All', path: '', icon: <FaThLarge /> },
        { name: 'Electronics', path: 'electronics', icon: <FaLaptop /> },
        { name: 'Furniture', path: 'furniture', icon: <FaCouch /> },
        { name: 'Clothing', path: 'clothing', icon: <FaTshirt /> },
        { name: 'Books', path: 'books', icon: <FaBook /> },
        { name: 'Sports', path: 'sports', icon: <FaBasketballBall /> },
        { name: 'Vehicles', path: 'vehicles', icon: <FaCar /> },
        { name: 'Toys', path: 'toys', icon: <FaPuzzlePiece /> },
        { name: 'Home Appliances', path: 'home-appliances', icon: <FaBlender /> },
        { name: 'Beauty', path: 'beauty', icon: <FaHeart /> },
        { name: 'Pets', path: 'pets', icon: <FaDog /> },
    ];

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:3001/listings/all');
                if (!response.data) throw new Error('No data received');
                setListings(response.data);
                setFilteredListings(response.data);
                setLoading(false);
            } catch (error) {
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
        filterListings(searchTerm, selectedCategory);
    };

    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        filterListings(value, selectedCategory);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        filterListings(searchTerm, category);
    };

    const filterListings = (search, category) => {
        let filtered = [...listings];
        if (search) {
            filtered = filtered.filter(listing =>
                listing.title?.toLowerCase().includes(search.toLowerCase()) ||
                listing.description?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (category && category !== 'all') {
            filtered = filtered.filter(listing =>
                listing.category?.toLowerCase() === category.toLowerCase()
            );
        }
        setFilteredListings(filtered);
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <nav className="navbar">
                <div className="d-flex align-items-center gap-4">
                    <a className="navbar-brand" href="#">Market</a>
                    <Link className="nav-link" to="/dashboard">Home</Link>
                    <Link className="nav-link" to="/upload">Create Listing</Link>
                    <Link className="nav-link" to="/my-messages">Messages</Link>
                    <Link className="nav-link" to="/my-listings">My Listings</Link>
                    <Link className="nav-link" to="/profile">Profile</Link>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <form className="search-form d-flex align-items-center" onSubmit={handleSearch}>
                        <input
                            className="search-input"
                            type="search"
                            placeholder="Search listings..."
                            value={searchTerm}
                            onChange={handleSearchInput}
                            aria-label="Search"
                        />
                        <button className="search-btn" type="submit">Search</button>
                    </form>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="flex-grow-1 d-flex">
                <div className="category-sidebar bg-light p-3">
                    <h5 className="mb-3">Categories</h5>
                    <ul className="list-unstyled">
                        {categories.map(({ name, path, icon }) => (
                            <li className="category-item" key={name}>
                                <button
                                    to={path ? `/category/${path}` : `/dashboard`}
                                    className={
                                        "category-btn d-inline-flex align-items-center gap-2 text-decoration-none" +
                                        (name !== 'All' && selectedCategory === name.toLowerCase() ? ' text-primary' : '')
                                    }
                                    onClick={() => handleCategoryClick(name.toLowerCase())}
                                >
                                    {icon}
                                    {name}
                                </button>
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
                        <div className="alert alert-danger">Error: {error}</div>
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
                                                    <p className="card-text"><strong className="text-primary">Price: ${listing.price}</strong></p>
                                                    <p className="card-text"><small className="text-muted">Posted by: {listing.username}</small></p>
                                                    <button
                                                        className="btn btn-outline-primary w-100"
                                                        onClick={() => navigate(`/send-message?recipient=${listing.username}&receiverId=${listing.ownerId}&listingId=${listing._id}&listingTitle=${listing.title}`)}
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
