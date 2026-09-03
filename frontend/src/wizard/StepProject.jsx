import Field from "./Field.jsx";
import { CATEGORIES } from "../constants.js";

export default function StepProject({ project, setProject, team, setTeam, errors }) {
  const setP = (k) => (e) => setProject((p) => ({ ...p, [k]: e.target.value }));
  const setT = (k) => (e) => setTeam((t) => ({ ...t, [k]: e.target.value }));
  return (
    <div>
      <h2 className="step-title">PROJECT DETAILS</h2>
      <div className="field-grid">
        <Field label="Project Title *" error={errors.projectTitle} full>
          <input value={team.projectTitle} onChange={setT("projectTitle")} />
        </Field>
        <Field label="Project Abstract *" error={errors.abstract} full>
          <textarea rows={6} value={project.abstract} onChange={setP("abstract")} />
        </Field>
      </div>
    </div>
  );
}
