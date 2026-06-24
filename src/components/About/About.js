import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./About.css";

function About({ profile }) {

  if (!profile) return null;

  return (
    <AnimatedSection>

    <section id="about" className="about">

      <div className="container">

        <h2 className="section-title">
          About Me
        </h2>

        <p className="about-text">
          {profile.About}
        </p>

      </div>

    </section>
    </AnimatedSection>
  );
}

export default About;