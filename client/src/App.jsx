// import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Dashboard from './dashboard'
import MyListings from './MyListings'
import Upload from './Upload'
import Home from './Home'
import ProtectedRoute from './ProtectedRoute'
import SendMessage from './Message'
import MyMessages from './MyMessages'
import Account from './Account'
import EditListing from './EditListing'
import Electronics from './categories/electronics'
import Furniture from './categories/furniture'
import Clothing from './categories/clothing'
import Books from './categories/Books'
import Sports from './categories/Sports'
import Vehicles from './categories/Vehicles'
import Toys from './categories/Toys'
import HomeAppliances from './categories/HomeAppliances'
import Beauty from './categories/Beauty'
import Pets from './categories/Pets'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-messages"
          element={
            <ProtectedRoute>
              <MyMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/send-message"
          element={
            <ProtectedRoute>
              <SendMessage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-listing/:id"
          element={
            <ProtectedRoute>
              <EditListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/electronics"
          element={
            <ProtectedRoute>
              <Electronics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/furniture"
          element={
            <ProtectedRoute>
              <Furniture />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/clothing"
          element={
            <ProtectedRoute>
              <Clothing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/sports"
          element={
            <ProtectedRoute>
              <Sports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/toys"
          element={
            <ProtectedRoute>
              <Toys />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/home-appliances"
          element={
            <ProtectedRoute>
              <HomeAppliances />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/beauty"
          element={
            <ProtectedRoute>
              <Beauty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/pets"
          element={
            <ProtectedRoute>
              <Pets />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App