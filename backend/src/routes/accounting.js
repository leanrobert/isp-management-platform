const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/**
 * POST /api/accounting/session - Record new session
 */
router.post("/session", async (req, res) => {
  const { pppoe_user_id, session_start } = req.body;
  try {
    const [result] = await pool.execute(
      "INSERT INTO accounting_sessions (pppoe_user_id, session_start) VALUES (?, ?)",
      [pppoe_user_id, session_start || new Date()],
    );
    res.status(201).json({ session_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/accounting/session/:id - Close session and update usage
 */
router.put("/session/:id", async (req, res) => {
  const { session_end, bytes_in, bytes_out } = req.body;
  try {
    await pool.execute(
      "UPDATE accounting_sessions SET session_end = ?, bytes_in = ?, bytes_out = ?, duration_seconds = TIMESTAMPDIFF(SECOND, session_start, ?) WHERE id = ?",
      [session_end, bytes_in, bytes_out, session_end, req.params.id],
    );
    res.json({ updated: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/accounting/usage/:client_id - Get current period usage
 */
router.get("/usage/:client_id", async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const [rows] = await pool.execute(
      `
      SELECT
        COALESCE(SUM(bytes_in + bytes_out), 0) as total_bytes,
        COALESCE(SUM(duration_seconds), 0) as total_seconds
      FROM
        accounting_sessions ac
        JOIN pppoe_users pu ON ac.pppoe_user_id = pu.id
      WHERE
        pu.client_id = ?
        AND YEAR(ac.session_start) = ?
        AND MONTH(ac.session_start) = ?
    `,
      [req.params.client_id, year, month],
    );

    const total_gb = (rows[0].total_bytes / (1024 * 1024 * 1024)).toFixed(2);
    res.json({
      client_id: req.params.client_id,
      period: `${year}-${month}`,
      total_gb,
      total_seconds: rows[0].total_seconds,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
