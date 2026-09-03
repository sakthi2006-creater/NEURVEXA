import { useState } from "react";
import { useRegistrationWindow } from "./hooks.js";

import NeuralBackground3D from "./components/NeuralBackground3D.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import DeadlineCard from "./components/DeadlineCard.jsx";
import About from "./components/About.jsx";
import Categories from "./components/Categories.jsx";
import Guidelines from "./components/Guidelines.jsx";
import Coordinators from "./components/Coordinators.jsx";
import Footer from "./components/Footer.jsx";

import RegistrationWizard from "./wizard/RegistrationWizard.jsx";
import StatusCheck from "./pages/StatusCheck.jsx";
import OrganizerPanel from "./pages/OrganizerPanel.jsx";

export default function App() {
  const [route, setRoute] = useState("home"); // home | register | status | organizer
  const win = useRegistrationWindow();
  const isOpen = true; // win.phase === "open";

  const scrollTo = (id) => {
    setRoute("home");
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <div className="app">
      <NeuralBackground3D />
      <div className="bg-veil" />

      <Navbar route={route} setRoute={setRoute} scrollTo={scrollTo} isOpen={isOpen} />

      {route === "home" && (
        <div className="page-transition">
          <Hero setRoute={setRoute} isOpen={isOpen} win={win} />
          <DeadlineCard win={win} setRoute={setRoute} isOpen={isOpen} />
          <About />
          <Categories />
          <Guidelines />
          <Coordinators />
          <Footer setRoute={setRoute} />
        </div>
      )}

      {route === "register" && (
        <div className="page-transition">
          <RegistrationWizard isOpen={isOpen} phase={win.phase} onDone={() => setRoute("home")} />
        </div>
      )}

      {route === "status" && (
        <div className="page-transition">
          <StatusCheck onBack={() => setRoute("home")} />
        </div>
      )}

      {route === "organizer" && (
        <div className="page-transition">
          <OrganizerPanel onBack={() => setRoute("home")} />
        </div>
      )}
    </div>
  );
}
