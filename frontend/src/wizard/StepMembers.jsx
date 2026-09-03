import Field from "./Field.jsx";
import { SECTIONS } from "../constants.js";

export function emptyMember() {
  return { name: "", email: "", mobile: "", college: "", department: "", section: "", year: "", regNo: "" };
}

export default function StepMembers({ members, setMembers, team, errors }) {
  const teamSize = 1 + members.length;
  const addMember = () => { if (members.length < 3) setMembers((m) => [...m, emptyMember()]); };
  const removeMember = (i) => setMembers((m) => m.filter((_, idx) => idx !== i));
  const updateMember = (i, k, v) => setMembers((m) => m.map((mem, idx) => idx === i ? { ...mem, [k]: v } : mem));

  return (
    <div>
      <h2 className="step-title">BUILD YOUR TEAM</h2>
      <div className="team-size-row"><span>TEAM SIZE</span><span className="team-size-badge">{teamSize} / 4</span></div>

      <div className="member-card">
        <div className="member-card-head"><span className="member-tag">TEAM LEADER · MEMBER 1</span></div>
        <div className="field-grid">
          <Field label="Name"><input value={team.leaderName} disabled /></Field>
          <Field label="Email"><input value={team.leaderEmail} disabled /></Field>
          <Field label="College"><input value={team.college} disabled /></Field>
          <Field label="Department"><input value={team.department} disabled /></Field>
          <Field label="Section"><input value={team.section} disabled /></Field>
          <Field label="Year"><input value={team.year} disabled /></Field>
          <Field label="Register Number"><input value={team.leaderReg} disabled /></Field>
        </div>
      </div>

      {members.map((m, i) => (
        <div className="member-card" key={i}>
          <div className="member-card-head">
            <span className="member-tag">MEMBER {i + 2}</span>
            <button className="link-btn" onClick={() => removeMember(i)}>REMOVE</button>
          </div>
          <div className="field-grid">
            <Field label="Full Name *" error={errors[`m${i}name`]}><input value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} /></Field>
            <Field label="Email *" error={errors[`m${i}email`]}><input value={m.email} onChange={(e) => updateMember(i, "email", e.target.value)} /></Field>
            <Field label="Mobile Number *" error={errors[`m${i}mobile`]}><input value={m.mobile} onChange={(e) => updateMember(i, "mobile", e.target.value)} /></Field>
            <Field label="College / Institution *" error={errors[`m${i}college`]}><input value={m.college} onChange={(e) => updateMember(i, "college", e.target.value)} /></Field>
            <Field label="Department *" error={errors[`m${i}department`]}><input value={m.department} onChange={(e) => updateMember(i, "department", e.target.value)} /></Field>
            <Field label="Section *" error={errors[`m${i}section`]}>
              <select value={m.section} onChange={(e) => updateMember(i, "section", e.target.value)}>
                <option value="">Select section</option>
                {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Year of Study *" error={errors[`m${i}year`]}><input value={m.year} onChange={(e) => updateMember(i, "year", e.target.value)} /></Field>
            <Field label="Register Number *" error={errors[`m${i}regNo`]}><input value={m.regNo} onChange={(e) => updateMember(i, "regNo", e.target.value)} /></Field>
          </div>
        </div>
      ))}

      {teamSize < 4 ? (
        <button className="btn btn-outline" onClick={addMember}>+ ADD TEAM MEMBER</button>
      ) : (
        <div className="max-reached">MAXIMUM TEAM SIZE REACHED</div>
      )}
    </div>
  );
}
