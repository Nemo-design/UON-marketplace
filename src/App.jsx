import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './dashboard';
import Upload from './upload';
import Home from './Home';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Signup />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/upload" element={<Upload />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;