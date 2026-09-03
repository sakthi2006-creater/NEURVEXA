import { pad } from "../constants.js";

export default function DeadlineCard({ win, setRoute, isOpen }) {
  const { phase, days, hours, mins, secs } = win;
  const pillClass = phase === "open" ? "pill-open" : phase === "upcoming" ? "pill-upcoming" : "pill-closed";
  const pillText = phase === "open" ? "REGISTRATION OPEN" : phase === "upcoming" ? "OPENING SOON" : phase === "loading" ? "LOADING…" : "REGISTRATION CLOSED";
  const label = phase === "upcoming" ? "REGISTRATION OPENS IN" : "REGISTRATION CLOSES IN";

  return (
    <section className="deadline-wrap">
      <div className="deadline-card">
        <div className="deadline-status">
          <span className={`pill ${pillClass}`}>{pillText}</span>
          <span className="deadline-range">28 AUGUST — 5 SEPTEMBER 2026</span>
        </div>
        {phase === "closed" ? (
          <p className="deadline-closed-msg">Registrations for NEURVEXA AI Project Expo 2026 are now closed.</p>
        ) : phase === "loading" ? (
          <p className="deadline-closed-msg">Checking registration window…</p>
        ) : (
          <>
            <p className="deadline-label">{label}</p>
            <div className="countdown">
              {[["DAYS", days], ["HOURS", hours], ["MINUTES", mins], ["SECONDS", secs]].map(([lbl, val]) => (
                <div className="count-unit" key={lbl}>
                  <span className="count-val">{pad(val)}</span>
                  <span className="count-label">{lbl}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" disabled={!isOpen} onClick={() => setRoute("register")}>
              {phase === "upcoming" ? "COMES BACK ON 28 AUGUST" : "REGISTER NOW"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
