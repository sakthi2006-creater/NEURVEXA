export default function StepConfirm({ team, members, project, files, agree, setAgree, errors }) {
  return (
    <div>
      <h2 className="step-title">REVIEW YOUR REGISTRATION</h2>

      <div className="review-block">
        <h4>TEAM INFORMATION</h4>
        <div className="review-row"><span>Team Name</span><span>{team.teamName}</span></div>
        <div className="review-row"><span>Team Leader</span><span>{team.leaderName}</span></div>
        <div className="review-row"><span>Team Members</span><span>{1 + members.length} / 4</span></div>
        <div className="review-row"><span>Institution</span><span>{team.college}</span></div>
        <div className="review-row"><span>Department</span><span>{team.department}{team.section ? ` — Section ${team.section}` : ""}</span></div>
      </div>

      <div className="review-block">
        <h4>PROJECT INFORMATION</h4>
        <div className="review-row"><span>Project Name</span><span>{team.projectName}</span></div>
        <div className="review-row"><span>Project Title</span><span>{team.projectTitle}</span></div>
        <div className="review-row"><span>Category</span><span>{team.category}</span></div>
        <div className="review-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
          <span>Project Abstract</span>
          <span style={{ color: "#F8FAFC", textAlign: "left", maxWidth: "100%" }}>{project.abstract}</span>
        </div>
      </div>

      <div className="review-block">
        <h4>DOCUMENTS</h4>
        {Object.entries(files).some(([, v]) => v) ? (
          Object.entries(files).filter(([, v]) => v).map(([k, v]) => (
            <div className="review-row" key={k}><span>{k}</span><span>{v.name}</span></div>
          ))
        ) : <div className="review-row"><span>No documents uploaded</span><span>—</span></div>}
      </div>

      <label className="checkbox-row">
        <input type="checkbox" checked={agree.correct} onChange={(e) => setAgree((a) => ({ ...a, correct: e.target.checked }))} />
        <span>I confirm that all information provided is correct.</span>
      </label>
      {errors.correct && <span className="field-error">{errors.correct}</span>}
      <label className="checkbox-row">
        <input type="checkbox" checked={agree.rules} onChange={(e) => setAgree((a) => ({ ...a, rules: e.target.checked }))} />
        <span>I agree to the NEURVEXA AI Project Expo rules and guidelines.</span>
      </label>
      {errors.rules && <span className="field-error">{errors.rules}</span>}
    </div>
  );
}
