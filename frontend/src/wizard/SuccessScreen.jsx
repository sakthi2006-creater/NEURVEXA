import PseudoQR from "../components/PseudoQR.jsx";

export default function SuccessScreen({ entry, onDone, onStatus }) {
  return (
    <section className="wizard-page">
      <div className="success-card glass-card">
        <div className="success-burst" />
        <span className="success-check">✓</span>
        <h2 className="success-title">REGISTRATION SUCCESSFUL</h2>
        <p className="success-event">NEURVEXA · AI PROJECT EXPO 2026</p>
        <div className="success-id">{entry.id}</div>
        <PseudoQR data={entry.id} />
        <div className="review-block" style={{ marginTop: 20, textAlign: "left" }}>
          <div className="review-row"><span>Team Name</span><span>{entry.team_name}</span></div>
          <div className="review-row"><span>Project Name</span><span>{entry.project_name}</span></div>
          <div className="review-row"><span>Registration Date</span><span>{new Date(entry.registered_at).toLocaleString()}</span></div>
        </div>
        <div className="success-actions">
          <a className="btn btn-primary" href="https://chat.whatsapp.com/JVEv83m0ynb6FsR0RPv0Mx" target="_blank" rel="noreferrer">
            💬 JOIN WHATSAPP GROUP
          </a>
          <button className="btn btn-outline" onClick={() => window.print()}>PRINT TICKET</button>
          <button className="btn btn-outline" onClick={onStatus}>CHECK STATUS</button>
          <button className="btn btn-ghost" onClick={onDone}>BACK TO HOME</button>
        </div>
      </div>
    </section>
  );
}
