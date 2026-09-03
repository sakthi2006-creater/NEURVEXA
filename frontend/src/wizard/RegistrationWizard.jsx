import { useState } from "react";
import { pad, EMAIL_RE, MOBILE_RE, URL_RE } from "../constants.js";
import { submitRegistration } from "../api.js";
import StepTeam from "./StepTeam.jsx";
import StepMembers from "./StepMembers.jsx";
import StepProject from "./StepProject.jsx";
import StepUpload from "./StepUpload.jsx";
import StepConfirm from "./StepConfirm.jsx";
import SuccessScreen from "./SuccessScreen.jsx";

const STEP_LABELS = ["TEAM", "MEMBERS", "PROJECT", "UPLOAD", "CONFIRM"];

export default function RegistrationWizard({ isOpen, phase, onDone }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const [team, setTeam] = useState({
    teamName: "", projectName: "", projectTitle: "", category: "",
    college: "", department: "", section: "", year: "", city: "",
    leaderName: "", leaderEmail: "", leaderMobile: "", leaderReg: "",
  });
  const [members, setMembers] = useState([]);
  const [project, setProject] = useState({
    abstract: "", problem: "", solution: "", aiDomain: "", aiModel: "",
    dataset: "", languages: "", frameworks: "", technologies: "",
    status: "Idea", outcome: "", github: "", demo: "", video: "",
  });
  const [files, setFiles] = useState({ abstractPdf: null, presentation: null, poster: null, video: null, supporting: null });
  const [agree, setAgree] = useState({ correct: false, rules: false });

  if (!isOpen) {
    const upcoming = phase === "upcoming";
    return (
      <section className="wizard-page">
        <div className="closed-notice">
          <span className={`pill ${upcoming ? "pill-upcoming" : "pill-closed"}`}>
            {upcoming ? "OPENING SOON" : "REGISTRATION CLOSED"}
          </span>
          <h2>
            {upcoming
              ? "Registration opens on 28 August 2026 at 00:00. Come back then to register your team."
              : "Registrations for NEURVEXA AI Project Expo 2026 are now closed."}
          </h2>
          <button className="btn btn-ghost" onClick={onDone}>BACK TO HOME</button>
        </div>
      </section>
    );
  }

  if (submitted) return <SuccessScreen entry={submitted} onDone={onDone} onStatus={onDone} />;

  function validateStep(current) {
    const e = {};
    if (current === 0) {
      if (!team.teamName.trim()) e.teamName = "Team name is required.";
      if (!team.projectName.trim()) e.projectName = "Project name is required.";
      if (!team.category) e.category = "Select a project category.";
      if (!team.college.trim()) e.college = "College / institution is required.";
      if (!team.department.trim()) e.department = "Department is required.";
      if (!team.section) e.section = "Select a section.";
      if (!team.year.trim()) e.year = "Year of study is required.";
      if (!team.leaderName.trim()) e.leaderName = "Leader name is required.";
      if (!EMAIL_RE.test(team.leaderEmail)) e.leaderEmail = "Please enter a valid email address.";
      if (!MOBILE_RE.test(team.leaderMobile)) e.leaderMobile = "Please enter a valid 10-digit mobile number.";
    }
    if (current === 1) {
      members.forEach((m, i) => {
        if (!m.name.trim()) e[`m${i}name`] = "Required.";
        if (!EMAIL_RE.test(m.email)) e[`m${i}email`] = "Invalid email.";
        if (!MOBILE_RE.test(m.mobile)) e[`m${i}mobile`] = "Invalid mobile.";
        if (!m.college.trim()) e[`m${i}college`] = "Required.";
        if (!m.department.trim()) e[`m${i}department`] = "Required.";
        if (!m.section) e[`m${i}section`] = "Required.";
        if (!m.year.trim()) e[`m${i}year`] = "Required.";
        if (!m.regNo.trim()) e[`m${i}regNo`] = "Required.";
      });
    }
    if (current === 2) {
      if (!team.projectTitle.trim()) e.projectTitle = "Project title is required.";
      if (!project.abstract.trim()) e.abstract = "Project abstract is required.";
    }
    if (current === 4) {
      if (!agree.correct) e.correct = "Please confirm your information is correct.";
      if (!agree.rules) e.rules = "Please agree to the rules and guidelines.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validateStep(step)) setStep((s) => Math.min(s + 1, 4)); }
  function back() { setErrors({}); setStep((s) => Math.max(s - 1, 0)); }

  async function submit() {
    if (!validateStep(4)) return;
    if (submitting) return;
    setSubmitting(true);
    setServerError("");
    try {
      const { registration } = await submitRegistration({ team, members, project, files });
      setSubmitted(registration);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const pct = ((step + 1) / 5) * 100;

  return (
    <section className="wizard-page">
      <div className="wizard-progress">
        <div className="wizard-steps">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className={`wizard-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
              <span className="wizard-step-num">{pad(i + 1)}</span>
              <span className="wizard-step-label">{label}</span>
            </div>
          ))}
        </div>
        <div className="wizard-bar"><div className="wizard-bar-fill" style={{ width: `${pct}%` }} /></div>
        <div className="wizard-meta">STEP {pad(step + 1)} / 05 · {Math.round(pct)}%</div>
      </div>

      <div className="wizard-body glass-card">
        {serverError && <div className="alert-error">{serverError}</div>}
        {step === 0 && <StepTeam team={team} setTeam={setTeam} errors={errors} />}
        {step === 1 && <StepMembers members={members} setMembers={setMembers} team={team} errors={errors} />}
        {step === 2 && <StepProject project={project} setProject={setProject} team={team} setTeam={setTeam} errors={errors} />}
        {step === 3 && <StepUpload files={files} setFiles={setFiles} />}
        {step === 4 && (
          <StepConfirm team={team} members={members} project={project} files={files} agree={agree} setAgree={setAgree} errors={errors} />
        )}
        <div className="wizard-nav">
          {step > 0 ? <button className="btn btn-ghost" onClick={back}>BACK</button> : <button className="btn btn-ghost" onClick={onDone}>CANCEL</button>}
          {step < 4 ? (
            <button className="btn btn-primary" onClick={next}>CONTINUE</button>
          ) : (
            <button className="btn btn-primary" disabled={submitting} onClick={submit}>
              {submitting ? "SUBMITTING..." : "🚀 COMPLETE REGISTRATION"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
