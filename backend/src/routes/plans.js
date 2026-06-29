const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/**
 * GET /api/plans - List all plans
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM plans ORDER BY price");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
