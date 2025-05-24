import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Popup} from 'reactjs-popup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import {
    FaLaptop, FaCouch, FaTshirt, FaBook,
    FaBasketballBall, FaCar, FaPuzzlePiece,
    FaBlender, FaHeart, FaDog, FaThLarge, FaUserCircle
} from 'react-icons/fa';

function Dashboard() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const [filteredListings, setFilteredListings] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();
    const [expandedCards, setExpandedCards] = useState({});

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
    const toggleExpand = (id) => {
        setExpandedCards((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      receiverId,
      senderId,
      message,
      listingTitle,
      listingId,
    };
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3001/send-message', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback('Message sent successfully!');
    } catch (error) {
      setFeedback('Failed to send the message. Please try again.');
    }
    navigate('/my-messages'); // 发送后跳转
    setMessage('');
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
                    <Link
                        to="/profile"
                        className="nav-link p-0 d-flex align-items-center"
                        style={{ fontSize: '1.8rem' }}
                        title="Profile"
                    >
                        <FaUserCircle />
                    </Link>
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

                <div className="flex-grow-1 mt-4">
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
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-6 g-4">
                            {filteredListings.length > 0 ? (
                                filteredListings.map((listing) => (
                                    <div key={listing._id} className="col">
                                        <div className="card h-100 shadow-sm">
                                            {listing.image && (
                                                <div className="listing-image-wrapper">
                                                    <img
                                                        src={`data:image/jpeg;base64,${listing.image}`}
                                                        className="listing-image card-img-top"
                                                        alt={listing.title}
                                                    />
                                                </div>
                                            )}
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title">{listing.title}</h5>
                                                <p className="card-text flex-grow-1">
                                                    {expandedCards[listing._id]
                                                        ? listing.description
                                                        : (listing.description && listing.description.length > 80
                                                            ? listing.description.slice(0, 80) + '...'
                                                            : listing.description)
                                                    }
                                                    {listing.description && listing.description.length > 80 && (
                                                        <button
                                                            className="show-more-btn"
                                                            onClick={() => toggleExpand(listing._id)}
                                                        >
                                                            {expandedCards[listing._id] ? 'Show less' : 'Show more'}
                                                        </button>
                                                    )}
                                                </p>
                                                <div className="mt-auto">
                                                    <p className="card-text"><strong className="text-primary">Price: ${listing.price}</strong></p>
                                                    <p className="card-text"><small className="text-muted">Posted by: {listing.username}</small></p>

                                                    <Popup trigger={<button className="btn btn-outline-primary w-100">Message</button>} modal nested>
                                                        {(close) => (
                                                            <div className="card p-4 custom-popup-content">
                                                                <button className="btn-close" onClick={close} aria-label="Close"></button>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
                                                                    
                                                                    <img
                                                                        src={`data:image/jpeg;base64,${listing.image}`}
                                                                        alt={listing.title}
                                                                        style={{ height: '100px', width: '100px', objectFit: 'cover' }}
                                                                    />
                                                                    <div>
                                                                        <h5 className="card-title">{listing.title}</h5>
                                                                        <h6 className="card-text">${listing.price}</h6>   
                                                                    </div>
                                                                </div>
                                                                <h5>Send Message to {listing.username}</h5>
                                                                <form
                                                                    onSubmit={async (e) => {
                                                                        e.preventDefault();
                                                                        const senderId = localStorage.getItem('userId');
                                                                        const receiverId = listing.ownerId || listing.userId;
                                                                        const listingTitle = listing.title;
                                                                        const listingId = listing._id;
                                                                        const token = localStorage.getItem('token');
                                                                        try {
                                                                            await axios.post('http://localhost:3001/send-message', {
                                                                                senderId,
                                                                                receiverId,
                                                                                listingId,
                                                                                listingTitle,
                                                                                message,
                                                                            }, {
                                                                                headers: { Authorization: `Bearer ${token}` },
                                                                            });
                                                                            setFeedback('Message sent successfully!');
                                                                            setMessage('');
                                                                            close();
                                                                            navigate('/my-messages');
                                                                        } catch (error) {
                                                                            setFeedback('Failed to send the message. Please try again.');
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="form-group mb-3">
                                                                        <label htmlFor="message" className="form-label">
                                                                            
                                                                        </label>
                                                                        <textarea 
                                                                            rows="4" 
                                                                            id="message"
                                                                            name="message"
                                                                            className="form-control" 
                                                                            placeholder="Type your message here..."
                                                                            value={message}
                                                                            onChange={(e) => setMessage(e.target.value)}
                                                                            required
                                                                        ></textarea>
                                                                    </div>
                                                                    <div className="d-flex justify-content-end">
                                                                        <button type="submit" className="btn btn-primary mt-2">Send</button>
                                                                    </div>
                                                                </form>
                                                                {feedback && (
                                                                    <div className="alert alert-info mt-4">
                                                                        {feedback}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Popup>
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
