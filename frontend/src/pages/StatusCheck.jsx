import { useState, useEffect } from "react";
import Field from "../wizard/Field.jsx";
import { checkStatus, fetchRegisteredTeams } from "../api.js";

export default function StatusCheck({ onBack }) {
  const [regId, setRegId] = useState("");
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(undefined);
  const [error, setError] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchRegisteredTeams()
      .then(setTeams)
      .catch((e) => {
        setTeams([]);
        setError(`Warning: Backend is offline or unreachable (${e.message}).`);
      });
  }, []);

  async function check() {
    setChecking(true);
    setResult(undefined);
    setError("");
    try {
      const { registration } = await checkStatus(regId, email);
      setResult(registration);
    } catch (err) {
      setError(err.message || "No registration found for that ID and email combination.");
      setResult(null);
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="wizard-page">
      <div className="glass-card status-card">
        <h2 className="step-title">CHECK YOUR REGISTRATION</h2>
        <div className="field-grid">
          <Field label="Registration ID"><input value={regId} onChange={(e) => setRegId(e.target.value)} placeholder="NVX-2026-XXXXX" /></Field>
          <Field label="Email Address"><input value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        </div>
        <button className="btn btn-primary" disabled={checking || !regId || !email} onClick={check}>
          {checking ? "CHECKING..." : "CHECK STATUS"}
        </button>

        {result === null && <div className="alert-error" style={{ marginTop: 16 }}>{error}</div>}
        {result && (
          <div className="review-block" style={{ marginTop: 20 }}>
            <div className="review-row"><span>Registration ID</span><span>{result.id}</span></div>
            <div className="review-row"><span>Team Name</span><span>{result.team_name}</span></div>
            <div className="review-row"><span>Project</span><span>{result.project_name}</span></div>
            <div className="review-row"><span>Status</span><span className="status-badge">{result.status}</span></div>
          </div>
        )}

        <button className="btn btn-ghost" style={{ marginTop: 20 }} onClick={onBack}>BACK TO HOME</button>
      </div>

      <div className="glass-card status-card" style={{ marginTop: 24 }}>
        <h2 className="step-title">REGISTERED TEAMS ({teams.length})</h2>
        {error && error.includes("offline") && (
          <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>
        )}
        {teams.length === 0 ? (
          <p style={{ color: "#8b949e", textAlign: "center", padding: 20 }}>No teams registered yet.</p>
        ) : (
          <div className="teams-list" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {teams.map((t, i) => (
              <div key={i} className="review-block" style={{ marginBottom: 0, padding: 12 }}>
                <div style={{ fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>{t.teamName}</div>
                <div style={{ fontSize: "0.85rem", color: "#8b949e" }}>{t.projectTitle} • {t.category}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
