const XLSX = require("xlsx");
const { readDb, writeDb } = require("../db");

async function checkAndExport() {
  // Use explicit IST offset to avoid server timezone issues
  const closeAt = new Date(process.env.REG_CLOSE || "2026-09-05T23:59:59+05:30");
  const now = new Date();
  
  // Safe test mode: allows triggering the export NOW without marking finalExportSent
  const isTestMode = process.env.TEST_EXPORT === "true";

  // If deadline has passed (or test mode active)
  if (now > closeAt || isTestMode) {
    const data = readDb();
    
    // Check safety lock
    if (!data.finalExportSent || isTestMode) {
      console.log(`[ExportJob] Trigger condition met (Test Mode: ${isTestMode}). Generating Excel...`);
      
      try {
        await sendExcelExport(data.registrations || []);
        console.log("[ExportJob] Email successfully sent to FormSubmit!");
        
        // ONLY lock if this is a real production export (not a test)
        if (!isTestMode) {
          data.finalExportSent = true;
          writeDb(data);
          console.log("[ExportJob] SAFETY LOCK ENGAGED: Real export marked as complete.");
        }
      } catch (err) {
        console.error("[ExportJob] CRITICAL ERROR: Failed to send final Excel export:", err);
        // We do NOT set finalExportSent=true here, allowing the cron job to safely retry next minute.
      }
    }
  }
}

async function sendExcelExport(registrations) {
  // 1. Flatten the registration data for Excel
  const flatData = registrations.map(r => {
    const row = {
      "Reg ID": r.id,
      "Team Name": r.teamName,
      "Project Name": r.projectName,
      "Project Title": r.projectTitle,
      "Category": r.category,
      "College": r.college,
      "Department": r.department,
      "Section": r.section,
      "Year": r.year,
      "City": r.city,
      "Leader Name": r.leaderName,
      "Leader Email": r.leaderEmail,
      "Leader Mobile": r.leaderMobile,
      "Leader RegNo": r.leaderReg,
      "Abstract": r.abstract,
      "Status": r.status,
      "Registered At": r.registeredAt,
    };
    
    // Append member fields dynamically
    (r.members || []).forEach((m, i) => {
      row[`Member ${i+2} Name`] = m.name;
      row[`Member ${i+2} Email`] = m.email;
      row[`Member ${i+2} Mobile`] = m.mobile;
      row[`Member ${i+2} College`] = m.college;
      row[`Member ${i+2} Dept`] = m.department;
      row[`Member ${i+2} Section`] = m.section;
      row[`Member ${i+2} Year`] = m.year;
      row[`Member ${i+2} RegNo`] = m.regNo;
    });
    
    return row;
  });

  // 2. Generate the Excel Workbook
  const ws = XLSX.utils.json_to_sheet(flatData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registrations");
  
  // Write to a buffer
  const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  // 3. Prepare the email via FormSubmit
  const form = new FormData();
  form.append("_subject", "FINAL EXPORT: Neurvexa Registrations Closed");
  form.append("_captcha", "false");
  form.append("message", `Registration deadline has passed. Find attached the final list of ${registrations.length} registered teams.`);
  
  // Convert Node Buffer to Blob for native fetch FormData
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  form.append("attachment", blob, "Neurvexa_Final_Registrations.xlsx");

  // 4. Send the POST request to FormSubmit secretly from the backend
  const targetEmail = "sakthii31072006@gmail.com";
  const res = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: form
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "FormSubmit rejected the request");
  }
}

// Start a timer to check every 1 minute if the deadline has passed
function startExportCron() {
  // Check immediately on startup
  checkAndExport();
  // Check every 1 minute
  setInterval(checkAndExport, 60 * 1000);
}

module.exports = { startExportCron };
