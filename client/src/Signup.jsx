import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // 引入自定义 CSS

function Login() {
  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/register', { Username, Email, Password })
        .then((res) => {
          console.log(res);
          navigate('/login');
        })
        .catch((err) => { console.log(err); });
  };
    return (
        <div className="min-vh-100 d-flex flex-column">
            {/* 导航栏 Navigation Bar */}
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
                        </ul>

                        {/* 搜索栏 Search Bar */}
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

            {/* 主内容 Main Content */}
            <div className="flex-grow-1 d-flex">
                {/* 类别栏 Categories */}
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

                {/* LOGIN */}
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="custom-border text-center">
                        <h1 className="mb-4">Login to UON Community Market</h1>
                        <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input type="text" 
                          id="username" 
                          name="username" 
                          placeholder='Username' 
                          required onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <input type="email" 
                          id="email" 
                          name="email" 
                          placeholder='Email' 
                          required onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <input type="password" 
                          id="password" 
                          name="password" 
                          placeholder='Password' 
                          required onChange={(e) => setPassword(e.target.value)} />
                        </div>
                          <button type="submit" className="btn btn-success">Sign Up</button>
                        <div>
                        <Link to="/login">Already have an account? Log in</Link>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;