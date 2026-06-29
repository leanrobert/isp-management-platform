const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/**
 * GET /api/clients - List all clients with their plans
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        c.*,
        p.name AS plan_name,
        p.quota_gb,
        p.download_speed,
        p.upload_speed
      FROM
        clients c
        LEFT JOIN plans p ON c.plan_id = p.id
      ORDER BY
        c.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/clients/:id - Get a single client with usage
 */
router.get("/:id", async (req, res) => {
  try {
    const [clients] = await pool.execute(
      `
      SELECT
        c.*,
        p.name AS plan_name,
        p.quota_gb,
      FROM
        clients c
        LEFT JOIN plans p ON c.plan_id = p.id
      WHERE
        c.id = ?
    `,
      [req.params.id],
    );

    if (clients.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    const [usage] = await pool.execute(
      `
      SELECT
        *
      FROM
        quota_usage
      WHERE
        client_id = ?
      ORDER BY
        period_year DESC,
        period_month DESC
      LIMIT 12
    `,
      [req.params.id],
    );

    res.json({ ...clients[0], usage_history: usage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/clients - Create new client
 */
router.post("/", async (req, res) => {
  const { full_name, email, phone, address, plan_id } = req.body;
  try {
    const [result] = await pool.execute(
      "INSERT INTO clients (full_name, email, phone, address, plan_id) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, phone, address, plan_id],
    );
    res.status(201).json({ id: result.insertId, full_name, email, plan_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
