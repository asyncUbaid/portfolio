import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./Skills.css";

function Skills({ skills }) {
  return (
    <AnimatedSection>

    <section id="skills" className="skills-section">
      <div className="container">

        <h2 className="section-title">
          Skills
        </h2>

        <div className="skills-grid">

          {skills.map((skill, index) => (
            <div className="skill-card" key={index}>

              <div className="skill-header">
                <span>{skill.Skill}</span>
                <span>{skill.Level}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${skill.Level}%`
                  }}
                />
              </div>

              <small>{skill.Category}</small>

            </div>
          ))}

        </div>

      </div>
    </section>
    </AnimatedSection>
  );
}

export default Skills;