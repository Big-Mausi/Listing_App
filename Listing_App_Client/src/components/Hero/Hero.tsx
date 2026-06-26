import { useEffect, useState } from 'react';
import './style.css';

const phrases = [
  "Find your dream home today.",
  "Luxury listings at unbeatable prices.",
  "Live where it feels like vacation.",
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const rotate = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(rotate);
  }, []);

  return (
    <section className="hero">
      <video
        className="hero-video"
        src="/ramos.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">Your home, redefined.</h1>
        <p className="hero-subtitle">{phrases[index]}</p>
      </div>
    </section>
  );
};

export default Hero;
