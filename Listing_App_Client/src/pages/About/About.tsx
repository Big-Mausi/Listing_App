import { Link } from 'react-router-dom';
import './style.css';

const About = () => {
  return (
    <div className="about-page">
      <Link to="/" className="back-link">← Back to Home</Link>
      <section className="hero-section">
        <h2>Shelta Asset: Your Home, Our Passion</h2>
        <p className="hero-tagline">Discover the Art of Living with Nigeria’s Premier Real Estate Experts</p>
        <Link to="/" className="cta-button">Find Your Perfect Property</Link>
      </section>

      <section className="overview-section">
        <h2> About Shelta Real Asset</h2>
        <div className="overview-content">
          <p>
            At <strong>Shelta Real Asset</strong>, we believe a home is more than just a place—it's where life's moments are made. Established in 2025 in the heart of Lagos, our business has grown into a trusted name in Nigerian real estate. With a deep understanding of local markets and a passion for connecting people with spaces, we've helped thousands of families, investors, and dreamers find properties that inspire.
          </p>
          <p>
            Our approach is simple: prioritize your needs, leverage our expertise, and make every transaction seamless. From cozy apartments to luxury estates, we're dedicated to turning your real estate goals into reality.
          </p>
        </div>
      </section>

      
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="listings-grid">
          <span className="value-card">
            <h3>Trust</h3>
            <p>Transparency and integrity guide every deal we make, building lasting relationships with our clients.</p>
          </span>
          <span className="value-card">
            <h3>Innovation</h3>
            <p>We harness technology to simplify searches, streamline processes, and enhance your experience.</p>
          </span>
          <span className="value-card">
            <h3>Community</h3>
            <p>We're committed to creating spaces that strengthen neighborhoods and bring people together.</p>
          </span>
        </div>
      </section>

     
      <section className="testimonials-section">
        <h2>What Our Clients Say</h2>
        <div className="testimonials-grid">
          <div className="listing-card">
            <p>
              “Shelta Asset made buying our first home a dream come true. Their team was patient, knowledgeable, and truly cared about us.” - <em>Funmi & Chukwudi, Lagos</em>
            </p>
          </div>
          <div className="listing-card">
            <p>
              “Selling our property was stress-free thanks to Shelta Asset. They marketed it beautifully and got us a great price!” - <em>Aisha Bello, Abuja</em>
            </p>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <h2>Start Your Real Estate Journey Today</h2>
        <p>Whether buying, selling, or investing, Shelta Asset is here to guide you.</p>
        <Link to="/login" className="cta-button">Create a Listing</Link>
        <Link to="/" className="cta-button secondary">Browse Properties</Link>
      </section>

    </div>
  );
};

export default About;