import Field from "./Field.jsx";
import { CATEGORIES, SECTIONS } from "../constants.js";

export default function StepTeam({ team, setTeam, errors }) {
  const set = (k) => (e) => setTeam((t) => ({ ...t, [k]: e.target.value }));
  return (
    <div>
      <h2 className="step-title">TEAM INFORMATION</h2>
      {errors.duplicate && <div className="alert-error">{errors.duplicate}</div>}
      <div className="field-grid">
        <Field label="Team Name *" error={errors.teamName}><input value={team.teamName} onChange={set("teamName")} /></Field>
        <Field label="Project Title *" error={errors.projectName}><input value={team.projectName} onChange={set("projectName")} /></Field>
        <Field label="Project Domain *" error={errors.category}>
          <select value={team.category} onChange={set("category")}>
            <option value="">Select domain</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="College / Institution *" error={errors.college}><input value={team.college} onChange={set("college")} /></Field>
        <Field label="Department *" error={errors.department}><input value={team.department} onChange={set("department")} placeholder="e.g. AI & Data Science" /></Field>
        <Field label="Section *" error={errors.section}>
          <select value={team.section} onChange={set("section")}>
            <option value="">Select section</option>
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Year of Study *" error={errors.year}><input value={team.year} onChange={set("year")} placeholder="e.g. 2nd Year" /></Field>

      </div>
      <h3 className="step-subtitle">TEAM LEADER</h3>
      <div className="field-grid">
        <Field label="Full Name *" error={errors.leaderName}><input value={team.leaderName} onChange={set("leaderName")} /></Field>
        <Field label="Email Address *" error={errors.leaderEmail}><input type="email" value={team.leaderEmail} onChange={set("leaderEmail")} /></Field>
        <Field label="Mobile Number *" error={errors.leaderMobile}><input value={team.leaderMobile} onChange={set("leaderMobile")} placeholder="10-digit number" /></Field>
        <Field label="Register Number / Roll Number"><input value={team.leaderReg} onChange={set("leaderReg")} /></Field>
      </div>
    </div>
  );
}
