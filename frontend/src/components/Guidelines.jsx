import { GUIDELINES, pad } from "../constants.js";

export default function Guidelines() {
  return (
    <section id="guidelines" className="section">
      <h2 className="section-title">GUIDELINES</h2>
      <div className="timeline-container">
        <div className="timeline-line"></div>
        {GUIDELINES.map((g, i) => (
          <div className={`timeline-item ${i % 2 === 0 ? "left" : "right"}`} key={i} style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-num">{pad(i + 1)}</span>
              <p>{g}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
