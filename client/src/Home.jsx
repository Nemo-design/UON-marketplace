import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'; // 引入自定义 CSS

function Home() {
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

                {/* 欢迎区域 Welcome Box */}
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="custom-border text-center">
                        <h1 className="mb-4">Welcome to Market</h1>

                        <div className="d-flex flex-column gap-3">
                            <Link to="/login" className="btn btn-primary btn-lg">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-success btn-lg">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;