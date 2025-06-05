import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Signup.css';
import {
    FaThLarge, FaLaptop, FaCouch, FaTshirt, FaBook,
    FaBasketballBall, FaCar, FaPuzzlePiece,
    FaBlender, FaHeart, FaDog
} from 'react-icons/fa';

function Signup() {
    const [Username, setUsername] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const categories = [
        { name: 'All', icon: <FaThLarge /> },
        { name: 'Electronics', icon: <FaLaptop /> },
        { name: 'Furniture', icon: <FaCouch /> },
        { name: 'Clothing', icon: <FaTshirt /> },
        { name: 'Books', icon: <FaBook /> },
        { name: 'Sports', icon: <FaBasketballBall /> },
        { name: 'Vehicles', icon: <FaCar /> },
        { name: 'Toys', icon: <FaPuzzlePiece /> },
        { name: 'Home Appliances', icon: <FaBlender /> },
        { name: 'Beauty', icon: <FaHeart /> },
        { name: 'Pets', icon: <FaDog /> }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Check if username or email already exists
            const checkRes = await axios.post('http://localhost:3001/check-user', {
                Username,
                Email
            });
            if (checkRes.data.exists) {
                setError(checkRes.data.message || 'Username or email already in use.');
                return;
            }
            // Proceed with registration
            await axios.post('http://localhost:3001/register', {
                Username,
                Email,
                Password
            });
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Registration failed.');
            }
        }
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
                        <input className="search-input" type="search" placeholder="Search" />
                        <button className="search-btn" type="submit">Search</button>
                    </form>
                </div>
            </nav>

            <div className="flex-grow-1 d-flex">
                <div className="category-sidebar bg-light p-3">
                    <h5 className="mb-3">Categories</h5>
                    <ul className="list-unstyled">
                        {categories.map(({ name, icon }) => (
                            <li className="category-item" key={name}>
                                <Link to={`/category/${name.toLowerCase().replace(/\s+/g, '-')}`} className="category-btn d-flex align-items-center gap-2">
                                    {icon} {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="custom-border text-center">
                        <h2>Create an Account</h2>
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} />
                            <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button type="submit">Sign Up</button>
                            <div>
                                <Link to="/login">Already have an account? Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;