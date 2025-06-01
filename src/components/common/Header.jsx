
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'; // adjust path if needed
import './Header.css'; // optional: import styles if you have them

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logo} alt="Blood Connect Logo" />
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/find-donors">Find Donors</Link>
          <Link to="/donate">Donate Blood</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
