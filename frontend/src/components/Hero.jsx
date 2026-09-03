import LogoMark from "./LogoMark.jsx";

export default function Hero({ setRoute, isOpen, win }) {
  return (
    <header id="top" className="hero">
      <div className="hero-content">
        <LogoMark size={104} glow />
        <h1 className="hero-title">
          NEURVEXA
          <span className="hero-title-sub">AI PROJECT EXPO 2026</span>
        </h1>
        <p className="hero-tagline">WHERE INTELLIGENCE MEETS INNOVATION</p>
        <p className="hero-desc">
          Showcase your ideas, demonstrate your intelligence, and transform innovative
          concepts into real-world AI solutions.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" disabled={!isOpen} onClick={() => setRoute("register")}>
            🚀 {win.phase === "upcoming" ? "OPENS 28 AUGUST" : win.phase === "closed" ? "REGISTRATION CLOSED" : "REGISTER YOUR TEAM"}
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
            EXPLORE EXPO
          </button>
        </div>
      </div>
    </header>
  );
}
