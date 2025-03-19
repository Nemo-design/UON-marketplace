// import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Dashboard from './dashboard'
import Upload from './upload'
import Home from './Home';
import ProtectedRoute from './ProtectedRoute'

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
      </Routes>
    </BrowserRouter>
  );
}

export default App
