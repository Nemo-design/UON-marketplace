// import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Dashboard from './dashboard'
import MyListings from './MyListings'
import Upload from './upload'
import Home from './Home';
import ProtectedRoute from './ProtectedRoute'
import SendMessage from './Message'
import MyMessages from './MyMessages'
import Account from './Account'
import EditListing from './EditListing'

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
      </Routes>
    </BrowserRouter>
  );
}

export default App
