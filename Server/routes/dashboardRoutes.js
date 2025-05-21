const express = require("express");
const router = express.Router();
const pool = require("../config/db");

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
        pr.motif,
        pr.user_id,
        s.name AS status,
        s.id AS status_id,         
        tm.name AS marche_type,
        u.department_id,
        d.name as department_name,
        u.name as user_name
      FROM purchase_requests pr
      LEFT JOIN status s ON pr.status_id = s.id
      LEFT JOIN type_marches tm ON pr.type_marche_id = tm.id
      LEFT JOIN users u ON pr.user_id = u.id
      LEFT JOIN departments d ON u.department_id = d.id
    `;

    // If user is chef departement, filter by their department
    if (userRole === 'chef_departement' || userRole === 'Chef Departement') {
      // First get the chef's department
      const [chefDept] = await pool.query(
        'SELECT department_id FROM users WHERE id = ?',
        [userId]
      );
      
      if (chefDept.length > 0) {
        // Check if this is the requests list page (status_id = 1) or dashboard (status_id > 1)
        const statusCondition = req.query.status === 'pending' ? 'pr.status_id = 1' : 'pr.status_id > 1';
        query += ` WHERE u.department_id = ${chefDept[0].department_id} AND ${statusCondition}`;
      } else {
        // If chef has no department, return empty array
        return res.json({ stats: [], requests: [] });
      }
    } else if (userRole === 'Prof') {
      // Filter requests for the logged-in professor
      query += ` WHERE pr.user_id = ${userId}`;
    }

    query += ` ORDER BY pr.created_at DESC`;

    const [requests] = await pool.query(query);

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

// GET /api/dashboard/request/:id
router.get("/request/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.query.userId;
    const userRole = req.query.userRole;

    // Base query for single request
    let query = `
      SELECT 
        pr.id,
        pr.title,
        pr.description,
        pr.created_at,
        pr.updated_at,
        pr.motif,
        pr.user_id,
        s.name AS status,
        s.id AS status_id,         
        tm.name AS marche_type,
        u.department_id,
        d.name as department_name,
        u.name as user_name
      FROM purchase_requests pr
      LEFT JOIN status s ON pr.status_id = s.id
      LEFT JOIN type_marches tm ON pr.type_marche_id = tm.id
      LEFT JOIN users u ON pr.user_id = u.id
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE pr.id = ?
    `;

    // If user is chef departement, verify they have access to this request
    if (userRole === 'chef_departement' || userRole === 'Chef Departement') {
      // Get the chef's department
      const [chefDept] = await pool.query(
        'SELECT department_id FROM users WHERE id = ?',
        [userId]
      );
      
      if (chefDept.length > 0) {
        query += ` AND u.department_id = ${chefDept[0].department_id}`;
      } else {
        return res.status(403).json({ error: "Accès non autorisé" });
      }
    } else if (userRole === 'Prof') {
      // Verify the request belongs to the professor
      query += ` AND pr.user_id = ${userId}`;
    }

    const [requests] = await pool.query(query, [requestId]);

    if (requests.length === 0) {
      return res.status(404).json({ error: "Demande non trouvée" });
    }

    res.json({ request: requests[0] });
  } catch (err) {
    console.error("Error fetching request:", err);
    res.status(500).json({ error: "Erreur lors de la récupération de la demande" });
  }
});

// POST /api/dashboard/validate-request
router.post("/validate-request", async (req, res) => {
  try {
    const { requestId, decision, comment, rejectionReason } = req.body;
    
    if (decision === 'approved') {
      // Get the status ID for "En cours d'examen"
      const [statusResult] = await pool.query(
        "SELECT id FROM status WHERE name = ?",
        ["En cours d'examen"]
      );

      if (statusResult.length === 0) {
        return res.status(404).json({ error: "Status not found" });
      }

      const statusId = statusResult[0].id;

      // Update request status to "En cours d'examen" and store optional comment
      await pool.query(
        "UPDATE purchase_requests SET status_id = ?, motif = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [statusId, comment || null, requestId]
      );
    } else if (decision === 'rejected') {
      // Get the status ID for "Rejeté"
      const [statusResult] = await pool.query(
        "SELECT id FROM status WHERE name = ?",
        ["Rejeté"]
      );

      if (statusResult.length === 0) {
        return res.status(404).json({ error: "Status not found" });
      }

      const statusId = statusResult[0].id;

      // Update request status to "Rejeté" and add rejection reason
      await pool.query(
        "UPDATE purchase_requests SET status_id = ?, motif = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [statusId, rejectionReason, requestId]
      );
    }

    res.json({ 
      status: "success",
      message: decision === 'approved' ? "Request approved" : "Request rejected"
    });
  } catch (err) {
    console.error("Error validating request:", err);
    res.status(500).json({ error: "Failed to validate request" });
  }
});

// POST /api/dashboard/update-status
router.post("/update-status", async (req, res) => {
  try {
    const { requestId, newStatus, validatorId, validatorName } = req.body;

    // Get the status ID for the new status
    const [statusResult] = await pool.query(
      "SELECT id FROM status WHERE name = ?",
      [newStatus]
    );

    if (statusResult.length === 0) {
      return res.status(404).json({ error: "Status not found" });
    }

    const statusId = statusResult[0].id;

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update request status
      await connection.query(
        "UPDATE purchase_requests SET status_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [statusId, requestId]
      );

      // Create validation record
      const comment = `Votre demande est validée par ${validatorName} au statut '${newStatus}'`;
      await connection.query(
        "INSERT INTO validations (request_id, validator_id, status_id, comment, validated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
        [requestId, validatorId, statusId, comment]
      );

      // Commit the transaction
      await connection.commit();
      connection.release();

      res.json({ 
        status: "success",
        message: "Status updated successfully"
      });
    } catch (err) {
      // Rollback in case of error
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
