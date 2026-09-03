require("dotenv").config();
const express = require("express");
const cors = require("cors");

const registrationsRouter = require("./routes/registrations");
const adminRouter = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true, service: "neurvexa-backend" }));

// Start background cron job for Excel export
const { startExportCron } = require("./jobs/exportJob");
startExportCron();

app.use("/api", registrationsRouter);
app.use("/api/admin", adminRouter);

// Generic error handler (never leak raw errors to the client)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`NEURVEXA backend running on http://localhost:${PORT}`);
  console.log(`NEURVEXA backend running on http://127.0.0.1:${PORT}`);
  console.log("Server reloaded successfully with new passcode!");
});
