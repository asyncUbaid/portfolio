import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./Experience.css";

function Experience({ experience }) {
  return (
    <AnimatedSection>
   <section
  id="experience"
  className="experience-section"
>
  <div className="container">

    <h2 className="section-title">
      Experience
    </h2>

    <div className="timeline">

      {experience.map((item, index) => (

        <div
          className="timeline-item"
          key={index}
        >

          <div className="timeline-marker" />
<div className="timeline-content">

  <span className="timeline-date">
    {item.StartDate}
    {item.EndDate
      ? ` - ${item.EndDate}`
      : " - Present"}
  </span>

  <h3 className="role">
    {item.Role}
  </h3>

  <h4 className="company">
    {item.Company}
  </h4>

  <p className="description">
    {item.Description}
  </p>

  <div className="tech-stack">
    {item.TechStack?.split(",").map(
      (tech, index) => (
        <span
          key={index}
          className="tech-badge"
        >
          {tech.trim()}
        </span>
      )
    )}
  </div>

</div>

        </div>

      ))}

    </div>

  </div>
</section>
    </AnimatedSection>
  );
}

export default Experience;
