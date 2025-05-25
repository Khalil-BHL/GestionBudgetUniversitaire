const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Route: Nombre de demandes par statut
router.get('/purchase-request-status', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.name AS statut, COUNT(*) AS count
      FROM purchase_requests pr
      JOIN status s ON pr.status_id = s.id
      GROUP BY s.name
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erreur dans /purchase-request-status:", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/statistics/approved-by-type-marche
router.get("/approved-by-type-marche", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        tm.name AS type_marche, 
        COUNT(pr.id) AS count
      FROM type_marches tm
      LEFT JOIN purchase_requests pr 
        ON pr.type_marche_id = tm.id 
        AND pr.status_id > 3 
        AND pr.status_id != 5
      GROUP BY tm.name
      ORDER BY tm.name
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching approved requests by type_marche", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/statistics/users-per-department
router.get("/users-per-department", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        d.name AS department,
        COUNT(u.id) AS user_count
      FROM departments d
      LEFT JOIN users u ON u.department_id = d.id
      GROUP BY d.name
      ORDER BY d.name
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching user count by department", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;