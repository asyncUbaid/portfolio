import "./Tools.css";

function Tools({ tools }) {
  return (
    <section className="tools-section">
      <div className="container">

        <h2 className="section-title">
          Tools & Technologies
        </h2>

        <div className="tools-grid">

          {tools.map((tool, index) => (
            <div
              key={index}
              className="tool-card"
            >
              {tool.Tool}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Tools;