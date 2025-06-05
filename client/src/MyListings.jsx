import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Popup} from 'reactjs-popup';
import './MyListings.css';
import { Link } from 'react-router-dom';
import {
    FaLaptop, FaCouch, FaTshirt, FaBook,
    FaBasketballBall, FaCar, FaPuzzlePiece,
    FaBlender, FaHeart, FaDog, FaThLarge, FaUserCircle, FaRegTrashAlt
} from 'react-icons/fa';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);
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
  // filepath: c:\Coding\Signup\client\src\MyListings.jsx
useEffect(() => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3001/my-listings', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      setListings(res.data);
      setFilteredListings(res.data); // Show all by default
      setLoading(false);
    })
    .catch((err) => {
      setError('Failed to load listings');
      setLoading(false);
    });
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
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        filterListings(searchTerm, category);
    };
  const handleEdit = (id) => {
    navigate(`/edit-listing/${id}`); // Redirect to the edit listing page
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setListings(listings.filter((listing) => listing._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const createListing = () => {
    navigate('/upload');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };
  const goToMessages = (listingId) => {
    navigate(`/listing/${listingId}/messages`); // Redirect to the messages page for the listing
  }

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
                                        <div className="card h-100 shadow-sm">
                                            {/* Show only the first image if available */}
                                            {listing.images && listing.images.length > 0 && (
                                                <div className="listing-image-wrapper">
                                                    <img
                                                        src={`data:image/jpeg;base64,${listing.images[0]}`}
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

                                                    <button onClick={() => handleEdit(listing._id)}>Edit</button>
                                                    <button onClick={() => goToMessages(listing._id)}>Messages</button>
                                                    <Popup trigger={<button className="btn btn-danger"><FaRegTrashAlt /></button>} modal>
                                                        {close => (
                                                            <div className="p-4">
                                                                <h5 style={{ color: 'white' }}>Confirm Deletion</h5>
                                                                <p style={{ color: 'white' }}>Are you sure you want to delete this listing?</p>
                                                                <button className="btn btn-danger" onClick={() => {handleDelete(listing._id); close();}}>Delete</button>
                                                                <button className="btn btn-secondary" onClick={close}>Cancel</button>
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
};

export default MyListings;