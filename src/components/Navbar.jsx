import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">UserApp</Link>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            Register
          </Link>
          <Link 
            to="/users" 
            className={`nav-item ${location.pathname === '/users' ? 'active' : ''}`}
          >
            User List
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
