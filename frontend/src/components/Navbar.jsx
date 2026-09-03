import { useEffect, useState } from "react";
import LogoMark from "./LogoMark.jsx";

export default function Navbar({ setRoute, scrollTo, isOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  const links = [
    ["HOME", "top"], ["ABOUT EXPO", "about"], ["CATEGORIES", "categories"],
    ["GUIDELINES", "guidelines"], ["COORDINATORS", "coordinators"], ["STATUS", "status-cta"],
  ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <div className="brand" onClick={() => scrollTo("top")}>
          <LogoMark size={34} />
          <span className="brand-text">NEURVEXA</span>
        </div>
        <div className="nav-links">
          {links.map(([label, id]) => (
            <button key={id} className="nav-link" onClick={() => id === "status-cta" ? setRoute("status") : scrollTo(id)}>
              {label}
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm nav-cta" onClick={() => setRoute("register")}>REGISTER NOW</button>
        <button className="hamburger" onClick={() => setMobileNav((v) => !v)} aria-label="Menu">
          <span className={mobileNav ? "bar bar1 open" : "bar bar1"} />
          <span className={mobileNav ? "bar bar2 open" : "bar bar2"} />
          <span className={mobileNav ? "bar bar3 open" : "bar bar3"} />
        </button>
      </div>
      {mobileNav && (
        <div className="mobile-menu">
          {links.map(([label, id]) => (
            <button key={id} className="mobile-link" onClick={() => { setMobileNav(false); id === "status-cta" ? setRoute("status") : scrollTo(id); }}>
              {label}
            </button>
          ))}
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => { setRoute("register"); setMobileNav(false); }}>
            REGISTER NOW
          </button>
        </div>
      )}
    </nav>
  );
}
