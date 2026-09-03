import { useEffect, useState } from "react";
import Field from "../wizard/Field.jsx";
import { fetchAdminRegistrations, adminExportCsvUrl, updateRegistrationStatus } from "../api.js";

export default function OrganizerPanel({ onBack }) {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [codeErr, setCodeErr] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadList(token) {
    setLoading(true);
    try {
      const { registrations } = await fetchAdminRegistrations(token);
      setRegistrations(registrations);
    } catch (e) {
      setCodeErr(e.message);
      setUnlocked(false);
    } finally {
      setLoading(false);
    }
  }

  async function tryUnlock() {
    setCodeErr("");
    try {
      await fetchAdminRegistrations(passcode);
      setUnlocked(true);
      loadList(passcode);
    } catch (e) {
      setCodeErr("Incorrect passcode.");
    }
  }

  async function setStatus(id, status) {
    try {
      await updateRegistrationStatus(passcode, id, status);
      loadList(passcode);
    } catch (e) {
      alert(e.message);
    }
  }

  if (!unlocked) {
    return (
      <section className="wizard-page">
        <div className="glass-card status-card">
          <h2 className="step-title">ORGANIZER ACCESS</h2>
          <p className="step-hint">Enter the organizer passcode to view the registered teams list.</p>
          <div className="field-grid">
            <Field label="Passcode" error={codeErr}>
              <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryUnlock()} />
            </Field>
          </div>
          <button className="btn btn-primary" onClick={tryUnlock}>UNLOCK</button>
          <button className="btn btn-ghost" style={{ marginLeft: 10 }} onClick={onBack}>BACK</button>
        </div>
      </section>
    );
  }

  return (
    <section className="wizard-page wide">
      <div className="glass-card">
        <h2 className="step-title">REGISTERED TEAMS ({registrations.length})</h2>
        <p className="step-hint">Use this list for certificates, or export as CSV below.</p>
        <div className="organizer-actions">
          <a className="btn btn-outline" href={adminExportCsvUrl(passcode)}>⬇ DOWNLOAD CSV</a>
          <button className="btn btn-ghost" onClick={onBack}>BACK TO HOME</button>
        </div>

        {loading && <p className="step-hint">Loading…</p>}
        {!loading && registrations.length === 0 && <p className="step-hint">No registrations yet.</p>}

        <div className="organizer-table-wrap">
          {registrations.map((r) => (
            <div className="organizer-row" key={r.id}>
              <div className="organizer-row-head">
                <span className="organizer-id">{r.id}</span>
                <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)}>
                  {["REGISTERED", "UNDER_REVIEW", "APPROVED", "REJECTED"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="review-row"><span>Team</span><span>{r.team_name}</span></div>
              <div className="review-row"><span>Leader</span><span>{r.leader_name} ({r.leader_email})</span></div>
              <div className="review-row"><span>Project</span><span>{r.project_name}</span></div>
              <div className="review-row"><span>Members</span><span>{1 + r.members.length} / 4</span></div>
              <div className="review-row"><span>Registered</span><span>{new Date(r.registered_at).toLocaleString()}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
