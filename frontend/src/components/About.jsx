export default function About() {
  const cards = [
    ["01", "INNOVATE", "Turn ideas into intelligent solutions.", "✦"],
    ["02", "BUILD", "Create practical AI-powered systems.", "❖"],
    ["03", "INSPIRE", "Showcase technology that creates impact.", "✧"],
  ];
  return (
    <section id="about" className="section">
      <h2 className="section-title">ABOUT NEURVEXA</h2>
      <p className="section-lede">
        NEURVEXA AI Project Expo is a platform for students, innovators and technology
        enthusiasts to showcase AI-powered ideas, research, prototypes and intelligent solutions.
      </p>
      <div className="card-grid three">
        {cards.map(([num, title, desc, icon], i) => (
          <div className="hologram-card" key={num} style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="holo-bg">{num}</div>
            <div className="holo-content">
              <div className="holo-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
