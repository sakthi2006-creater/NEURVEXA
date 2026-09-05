const API_URL = import.meta.env.VITE_API_URL || "/api";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export async function getRegistrationWindow() {
  const res = await fetch(`${API_URL}/window`);
  return handle(res);
}

export async function submitRegistration({ team, members, project, files }) {
  const formData = new FormData();
  
  // Flatten data so it looks nice in the email
  formData.append("Team Name", team.teamName || "");
  formData.append("Project Title", team.projectTitle || "");
  formData.append("Project Name", team.projectName || "");
  formData.append("Category", team.category || "");
  formData.append("Institution", team.college || "");
  formData.append("Department", team.department || "");
  formData.append("Section", team.section || "");
  formData.append("Year of Study", team.year || "");

  
  formData.append("Leader Name", team.leaderName || "");
  formData.append("Leader Email", team.leaderEmail || "");
  formData.append("Leader Mobile", team.leaderMobile || "");
  
  members.forEach((m, i) => {
    formData.append(`Member ${i+2} Name`, m.name || "");
    formData.append(`Member ${i+2} Email`, m.email || "");
    formData.append(`Member ${i+2} Mobile`, m.mobile || "");
  });
  
  formData.append("Project Abstract", project.abstract || "");
  
  // FormSubmit Settings (Allows FREE file attachments!)
  formData.append("_subject", `New Registration: ${team.teamName}`);
  formData.append("_captcha", "false"); 
  formData.append("_template", "table"); 
  
  Object.entries(files).forEach(([slot, file]) => {
    if (file) formData.append("attachment", file, file.name);
  });
  
  let realRegistration = null;
  // 1. Save to Local Database (so it shows on the Status page)
  try {
    const localFormData = new FormData();
    localFormData.append("payload", JSON.stringify({ team, members, project }));
    Object.entries(files).forEach(([slot, file]) => {
      if (file) localFormData.append(slot, file);
    });
    
    // We use the globally defined API_URL which goes through the Vite Proxy
    const dbRes = await fetch(`${API_URL}/registrations`, { method: "POST", body: localFormData });
    if (!dbRes.ok) {
      const errData = await dbRes.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to save to database.");
    }
    
    // Capture the real registration data from the backend
    const dbData = await dbRes.json();
    realRegistration = dbData.registration;
    
  } catch (e) {
    console.error("Local DB save failed (network/proxy error):", e);
    throw new Error(e.message || "Failed to connect to registration server.");
  }

  // 2. Send email via FormSubmit (free attachments)
  const res = await fetch("https://formsubmit.co/ajax/sakthi31072006@gmail.com", { 
    method: "POST", 
    headers: { "Accept": "application/json" },
    body: formData 
  });
  
  const data = await res.json().catch(() => ({}));
  if (!res.ok) console.error("Email notification failed, but DB save succeeded:", data);
  
  // Return the REAL object from the database, mapped to match what the SuccessScreen expects
  return { 
    registration: {
      id: realRegistration.id,
      team_name: realRegistration.teamName,
      project_name: realRegistration.projectName,
      leader_email: realRegistration.leaderEmail,
      registered_at: realRegistration.registeredAt
    } 
  };
}

export async function checkStatus(id, email) {
  const res = await fetch(`${API_URL}/registrations/status?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`);
  return handle(res);
}

export async function fetchRegisteredTeams() {
  const res = await fetch(`${API_URL}/teams`);
  return handle(res);
}

export async function adminLogin(passcode) {
  // Verified implicitly by the first authenticated request; we just store the passcode
  // client-side as the token expected by backend/middleware/auth.js.
  const res = await fetch(`${API_URL}/admin/registrations`, {
    headers: { "x-admin-token": passcode },
  });
  const data = await handle(res);
  return data;
}

export async function fetchAdminRegistrations(passcode) {
  const res = await fetch(`${API_URL}/admin/registrations`, {
    headers: { "x-admin-token": passcode },
  });
  return handle(res);
}

export function adminExportCsvUrl(passcode) {
  return `${API_URL}/admin/export.csv?token=${encodeURIComponent(passcode)}`;
}

export async function updateRegistrationStatus(passcode, id, status) {
  const res = await fetch(`${API_URL}/admin/registrations/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-admin-token": passcode },
    body: JSON.stringify({ status }),
  });
  return handle(res);
}
