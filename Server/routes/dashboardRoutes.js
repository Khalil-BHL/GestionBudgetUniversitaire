const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    // Get user info from request (assuming it's set by auth middleware)
    const userId = req.query.userId;
    const userRole = req.query.userRole;

    // Base query
    let query = `
      SELECT 
        pr.id,
        pr.title,
        pr.description,
        pr.created_at,
        pr.updated_at,
        s.name AS status,
        s.id AS status_id,         
        tm.name AS marche_type,
        u.department_id,
        d.name as department_name
      FROM purchase_requests pr
      LEFT JOIN status s ON pr.status_id = s.id
      LEFT JOIN type_marches tm ON pr.type_marche_id = tm.id
      LEFT JOIN users u ON pr.user_id = u.id
      LEFT JOIN departments d ON u.department_id = d.id
    `;

    // If user is chef departement, filter by their department
    if (userRole === 'chef_departement' || userRole === 'Chef Departement') {
      // First get the chef's department
      const [chefDept] = await db.query(
        'SELECT department_id FROM users WHERE id = ?',
        [userId]
      );
      
      if (chefDept.length > 0) {
        query += ` WHERE u.department_id = ${chefDept[0].department_id}`;
      }
    }

    query += ` ORDER BY pr.created_at DESC`;

    const [requests] = await db.query(query);

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
