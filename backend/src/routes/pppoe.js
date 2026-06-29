const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/database");

/**
 * GET /api/pppoe - List all PPPoE users
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT pu.*, c.full_name, c.plan_id
      FROM pppoe_users pu
      JOIN clients c ON pu.client_id = c.id
      ORDER BY pu.assigned_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/pppoe - Create PPPoE user (auto-assign IP)
 */
router.post("/", async (req, res) => {
  const { client_id, username, password, ip_address } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO pppoe_users (client_id, username, password_hash, ip_address) VALUES (?, ?, ?, ?)",
      [client_id, username, password_hash, ip_address],
    );
    res
      .status(201)
      .json({ id: result.insertId, client_id, username, ip_address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
