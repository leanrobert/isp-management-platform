const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/**
 * GET /api/dashboard/stats - Global statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const [[clients]] = await pool.execute(
      "SELECT COUNT(*) as total FROM clients",
    );
    const [[active]] = await pool.execute(
      "SELECT COUNT(*) as total FROM clients WHERE status = 'active'",
    );
    const [[pppoe]] = await pool.execute(
      "SELECT COUNT(*) as total FROM pppoe_users WHERE status = 'active'",
    );
    const [[plans]] = await pool.execute("SELECT COUNT(*) as total FROM plans");

    res.json({
      total_clients: clients.total,
      active_clients: active.total,
      active_pppoe: pppoe.total,
      total_plans: plans.total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/dashboard/top-consumers - Top consumers this month
 */
router.get("/top-consumers", async (req, res) => {
  try {
    const now = new Date();
    const [rows] = await pool.execute(
      `
      SELECT
        c.id,
        c.full_name,
        p.name as plan_name,
        p.quota_gb,
        COALESCE(SUM(ac.bytes_in + ac.bytes_out), 0) as total_bytes
      FROM
        clients c
        LEFT JOIN plans p ON c.plan_id = p.id
        LEFT JOIN pppoe_users pu ON pu.client_id = c.id
        LEFT JOIN accounting_sessions ac ON ac.pppoe_user_id = pu.id
          AND YEAR(ac.session_start) = ?
          AND MONTH(ac.session_start) = ?
      WHERE
        c.status = 'active'
      GROUP
        BY c.id
      ORDER
        BY total_bytes DESC
      LIMIT 20
    `,
      [now.getFullYear(), now.getMonth() + 1],
    );

    const with_gb = rows.map((r) => ({
      ...r,
      consumed_gb: (r.total_bytes / (1024 * 1024 * 1024)).toFixed(2),
      percentage: r.quota_gb
        ? ((r.total_bytes / (1024 * 1024 * 1024) / r.quota_gb) * 100).toFixed(1)
        : 0,
    }));

    res.json(with_gb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
