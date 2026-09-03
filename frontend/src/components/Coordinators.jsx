import { COORDINATORS } from "../constants.js";

export default function Coordinators() {
  return (
    <section id="coordinators" className="section">
      <h2 className="section-title">EVENT COORDINATORS</h2>
      <p className="section-lede">Reach out to the organizing team for any registration queries.</p>
      <div className="coord-cards-grid">
        {COORDINATORS.map((c, i) => (
          <div className="cyber-card" key={c.name} style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="cyber-card-content">
              <h3>{c.name}</h3>
              <p className="cyber-role">{c.role}</p>
              <div className="cyber-links">
                <a href={`tel:${c.phone.replace(/\s/g, "")}`}>
                  <span className="cyber-icon">✆</span> {c.phone}
                </a>
                {c.email && (
                  <a href={`mailto:${c.email}`}>
                    <span className="cyber-icon">✉</span> {c.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
