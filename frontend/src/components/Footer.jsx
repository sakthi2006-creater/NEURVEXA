import LogoMark from "./LogoMark.jsx";

export default function Footer({ setRoute }) {
  return (
    <footer id="register-cta" className="footer">
      <LogoMark size={40} />
      <h3>Ready to showcase your intelligence?</h3>
      <button className="btn btn-primary btn-lg" onClick={() => setRoute("register")}>🚀 REGISTER YOUR TEAM</button>
      <p className="footer-tag">WHERE INTELLIGENCE MEETS INNOVATION</p>
      <button className="organizer-link" onClick={() => setRoute("organizer")}>Organizer Access</button>
    </footer>
  );
}
