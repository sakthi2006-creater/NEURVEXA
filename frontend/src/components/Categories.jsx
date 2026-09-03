import { CATEGORIES } from "../constants.js";

export default function Categories() {
  return (
    <section id="categories" className="section">
      <h2 className="section-title">EXPLORE AI DOMAINS</h2>
      <div className="card-grid categories-grid">
        {CATEGORIES.map((c, i) => (
          <div className="glass-card category-card" key={c.id} style={{ animationDelay: `${i * 0.05}s` }}>
            <span className="cat-icon">{c.icon}</span>
            <span>{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
