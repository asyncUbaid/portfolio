import "./Stats.css";
import { motion } from "framer-motion";

function Stats({ stats }) {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((item, index) => (
            <motion.div
             className="stat-card"
              whileHover={{
                scale: 1.05,
              }}
            >
              <h3>{item.Value}</h3>

              <p>{item.Label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
