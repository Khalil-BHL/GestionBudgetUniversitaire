const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    const [requests] = await db.query(`
      SELECT 
        pr.id,
        pr.title,
        pr.description,
        pr.created_at,
        pr.updated_at,
        s.name AS status,
        s.id AS status_id,         
        tm.name AS marche_type
        FROM purchase_requests pr
        LEFT JOIN status s ON pr.status_id = s.id
        LEFT JOIN type_marches tm ON pr.type_marche_id = tm.id
        ORDER BY pr.created_at DESC;

    `);

    // Compute some statistics
    const total = requests.length;
    const approved = requests.filter((r) => r.status === "Approuvé").length;
    const inReview = requests.filter(
      (r) => r.status === "En cours d'examen"
    ).length;

    const stats = [
      {
        title: "Total Requests",
        value: total.toString(),
        change: "+3%",
        color: "#e6f7ef",
      },
      {
        title: "Approved",
        value: approved.toString(),
        change: "+2%",
        color: "#e6f7ef",
      },
      {
        title: "In Review",
        value: inReview.toString(),
        change: "+1%",
        color: "#e6f7ef",
      },
    ];

    res.json({ stats, requests });
  } catch (err) {
    console.error("Dashboard route error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data." });
  }
});

module.exports = router;
