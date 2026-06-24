import "./Hero.css";
import { motion } from "framer-motion";

function Hero({ profile }) {
  if (!profile) return null;

  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        {/* Left Content */}
        <motion.div
          className="hero-content"
          initial={{
            opacity: 0,
            x: -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <p className="hero-intro">Hello, I'm</p>

          <h1 className="hero-name">{profile.Name}</h1>

          <h2 className="hero-title">{profile.Title}</h2>

          <p className="hero-tagline">{profile.Tagline}</p>

          <div className="hero-buttons">
            <a
              href={profile.ResumeLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Download Resume
            </a>

            <a href="#contact" className="btn-secondary">
              Let's Connect
            </a>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="hero-image"
          initial={{
            opacity: 0,
            x: 50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
        >
          <div className="image-bg">
            <img
              src={profile.Picture}
              alt={profile.Name}
              className="profile-image"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
