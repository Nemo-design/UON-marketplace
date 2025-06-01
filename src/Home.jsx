import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import {
    FaLaptop, FaCouch, FaTshirt, FaBook,
    FaBasketballBall, FaCar, FaPuzzlePiece,
    FaBlender, FaHeart, FaDog, FaThLarge
} from 'react-icons/fa'

function Home() {
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

    const images = [
        'https://via.placeholder.com/600x300?text=Image+1',
        'https://via.placeholder.com/600x300?text=Image+2',
        'https://via.placeholder.com/600x300?text=Image+3'
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <nav className="navbar">
                <div className="d-flex align-items-center gap-4">
                    <a className="navbar-brand" href="#">Market</a>
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/login">Login</Link>
                    <Link className="nav-link" to="/register">Sign Up</Link>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <form className="search-form d-flex align-items-center">
                        <input
                            className="search-input"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                        />
                        <button className="search-btn" type="submit">Search</button>
                    </form>
                </div>
            </nav>

            <div className="flex-grow-1 d-flex">
                <div className="category-sidebar bg-light p-3">
                    <h5 className="mb-3">Categories</h5>
                    <ul className="list-unstyled">
                        {categories.map(({ name, path, icon }) => (
                            <li className="category-item" key={name}>
                                <Link
                                    to={path ? `/category/${path}` : `/dashboard`}
                                    className="category-btn d-inline-flex align-items-center gap-2 text-decoration-none"
                                >
                                    {icon}
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                    <div className="custom-border text-center mb-4">
                        <h1 className="mb-4">Welcome to UON Community Market</h1>
                        <div className="d-flex flex-column gap-3">
                            <Link to="/login" className="btn btn-primary home-btn">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-success home-btn">
                                Sign Up
                            </Link>
                        </div>
                    </div>

                    <div className="image-carousel text-center">
                        <img
                            src={images[currentImageIndex]}
                            alt={`Slide ${currentImageIndex + 1}`}
                            className="img-fluid mb-3"
                            style={{ maxHeight: '300px' }}
                        />
                        <div>
                            <button className="btn btn-secondary me-2" onClick={handlePrev}>
                                ← Prev
                            </button>
                            <button className="btn btn-secondary" onClick={handleNext}>
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
