import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import {
    FaLaptop, FaCouch, FaTshirt, FaBook,
    FaBasketballBall, FaCar, FaPuzzlePiece,
    FaBlender, FaHeart, FaDog, FaThLarge
} from 'react-icons/fa';

function Login() {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();

    const categories = [
        { name: 'All', icon: <FaThLarge />, path: '/dashboard' },
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
        axios.post('http://localhost:3001/login', { Email, Password })
            .then((res) => {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('username', res.data.username);
                    localStorage.setItem('userId', res.data.userId);
                    navigate('/dashboard');
                } else {
                    alert('Login failed. Please check your credentials and try again.');
                }
            })
            .catch(() => {
                alert('Login failed. Please check your credentials and try again.');
            });
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
                        {categories.map(({ name, icon, path }) => (
                            <li className="category-item" key={name} style={{ listStyle: 'none' }}>
                                <Link to={path || `/category/${name.toLowerCase().replace(/\s+/g, '-')}`} className="category-btn text-decoration-none">
                                    {icon} {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="custom-border text-center">
                        <h1 className="mb-4">Login to UON Community Market</h1>
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <input type="email" id="email" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} className="form-control" />
                            <input type="password" id="password" name="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} className="form-control" />
                            <button type="submit" className="btn btn-primary">Login</button>
                            <div>
                                <Link to="/register">Don't have an account? Sign up</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
