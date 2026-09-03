// Simple passcode-based admin gate for local/dev use.
// Replace with real authentication (Supabase Auth, JWT, etc.) before deploying.

function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"] || req.query.token;
  if (!token || token !== process.env.ADMIN_PASSCODE) {
    return res.status(401).json({ error: "Unauthorized. Invalid or missing admin passcode." });
  }
  next();
}

module.exports = { requireAdmin };
