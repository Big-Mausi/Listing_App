import { Link } from "react-router-dom";
import "./style.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} Houzes. All rights reserved.
        </p>

        <div className="footer-links">
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
