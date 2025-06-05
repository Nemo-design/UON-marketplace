import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Popup } from 'reactjs-popup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import {
    FaLaptop, FaCouch, FaTshirt, FaBook,
    FaBasketballBall, FaCar, FaPuzzlePiece,
    FaBlender, FaHeart, FaDog, FaThLarge, FaUserCircle,
    FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

function Dashboard() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredListings, setFilteredListings] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();
    const [expandedCards, setExpandedCards] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

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

    useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
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

    // Modal logic for large card
    const openModal = (listing) => {
        setSelectedListing(listing);
        setCarouselIndex(0);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setSelectedListing(null);
    };
    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCarouselIndex((prev) =>
            prev === 0 ? selectedListing.images.length - 1 : prev - 1
        );
    };
    const handleNextImage = (e) => {
        e.stopPropagation();
        setCarouselIndex((prev) =>
            prev === selectedListing.images.length - 1 ? 0 : prev + 1
        );
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
                        <span style={{ fontSize: '1rem', marginLeft: '8px' }}>
                            {username}
                        </span>
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
                                        <div
                                            className="card h-100 shadow-sm"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => openModal(listing)}
                                        >
                                            {listing.images && listing.images.length > 0 && (
                                                <div className="listing-image-wrapper">
                                                    <img
                                                        src={`data:image/jpeg;base64,${listing.images[0]}`}
                                                        alt={listing.title}
                                                        className="listing-image card-img-top"
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
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                toggleExpand(listing._id);
                                                            }}
                                                        >
                                                            {expandedCards[listing._id] ? 'Show less' : 'Show more'}
                                                        </button>
                                                    )}
                                                </p>
                                                <div className="mt-auto">
                                                    <p className="card-text"><strong className="text-primary">Price: ${listing.price}</strong></p>
                                                    <p className="card-text"><small className="text-muted">Posted by: {listing.username}</small></p>

                                                    <Popup trigger={<button className="btn btn-outline-primary w-100" onClick={e => e.stopPropagation()}>Message</button>} modal nested>
                                                        {(close) => (
                                                            <div className="card p-4 custom-popup-content">
                                                                <button className="btn-close" onClick={close} aria-label="Close" style={{ position: 'absolute', top: '10px', right: '10px' }}>x</button>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
                                                                    {listing.images && listing.images.length > 0 && (
                                                                        <img
                                                                            src={`data:image/jpeg;base64,${listing.images[0]}`}
                                                                            alt={listing.title}
                                                                            style={{ height: '100px', width: '100px', objectFit: 'cover' }}
                                                                        />
                                                                    )}
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
                                                                        <label htmlFor="message" className="form-label"></label>
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

            {/* Large Modal for Card */}
            {modalOpen && selectedListing && (
                <div
                    className="popup-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.55)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={closeModal}
                >
                    <div
                className="card p-4"
                style={{
                    maxWidth: 1300,
                    width: '99vw',
                    maxHeight: '99vh',
                    overflow: 'auto',
                    position: 'relative',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={e => e.stopPropagation()}
                >
                <button
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
                >x</button>
                {/* Carousel */}
                {selectedListing.images && selectedListing.images.length > 0 && (
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 28,
                            width: '100%',
                            minHeight: 520,
                        }}
                    >
                <img
                    src={`data:image/jpeg;base64,${selectedListing.images[carouselIndex]}`}
                    alt={selectedListing.title}
                    style={{
                        width: '100%',
                        maxWidth: 1200,
                        maxHeight: 520,
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: 16,
                        boxShadow: '0 2px 24px rgba(0,0,0,0.13)',
                        display: 'block',
                        background: '#f8f9fa'
                    }}
                />
                <button
                    type="button"
                    className="carousel-arrow left btn btn-light"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: 24,
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'rgba(255,255,255,0.7)',
                        fontSize: 54,
                        zIndex: 2
                    }}
                    onClick={handlePrevImage}
                    disabled={selectedListing.images.length <= 1}
                >
                    <FaChevronLeft />
                </button>
                <button
                    type="button"
                    className="carousel-arrow right btn btn-light"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: 24,
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'rgba(255,255,255,0.7)',
                        fontSize: 54,
                        zIndex: 2
                    }}
                    onClick={handleNextImage}
                    disabled={selectedListing.images.length <= 1}
                >
                    <FaChevronRight />
                </button>
            </div>
        )}
        <div>
            <h2 className="card-title">{selectedListing.title}</h2>
            <h4 className="card-text text-primary mb-2">${selectedListing.price}</h4>
            <p style={{ fontSize: '1.15rem' }}>{selectedListing.description}</p>
            <p className="card-text"><small className="text-muted">Posted by: {selectedListing.username}</small></p>
        </div>
        {/* Message box at the bottom */}
        <form
            style={{ marginTop: 'auto' }}
            onSubmit={async (e) => {
                e.preventDefault();
                const senderId = localStorage.getItem('userId');
                const receiverId = selectedListing.ownerId || selectedListing.userId;
                const listingTitle = selectedListing.title;
                const listingId = selectedListing._id;
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
                    closeModal();
                    navigate('/my-messages');
                } catch (error) {
                    setFeedback('Failed to send the message. Please try again.');
                }
            }}
        >
            <div className="form-group mb-3">
                <label htmlFor="popup-message" className="form-label">Send a message</label>
                <textarea
                    rows="3"
                    id="popup-message"
                    name="popup-message"
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
            {feedback && (
                <div className="alert alert-info mt-3">
                    {feedback}
                </div>
            )}
        </form>
    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;