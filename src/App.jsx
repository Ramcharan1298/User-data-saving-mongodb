import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserList from './pages/UserList';
import './App.css';

function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fatherName: '',
    occupation: '',
    college: '',
    address: '',
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'User registered successfully!' });
        setFormData({
          name: '',
          email: '',
          fatherName: '',
          occupation: '',
          college: '',
          address: '',
        });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '5rem' }}>
      <div className="form-wrapper">
        <header>
          <h1>User Registration</h1>
          <p>Please fill in your details below</p>
        </header>
        
        <form onSubmit={handleSubmit} className="entry-form">
          <div className="form-group">
            <label htmlFor="name">Full Name <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fatherName">Father's Name</label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Father's name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="occupation">Occupation</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Current occupation"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="college">College / University</label>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="College name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              rows="3"
            />
          </div>

          {status.message && (
            <div className={`status-message ${status.type}`}>
              {status.message}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Register User'}
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </Router>
  );
}

export default App;
