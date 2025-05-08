const pool = require("../config/db");

const createPurchaseRequest = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { title, description, quantity, type_marche_id } = req.body;
    const user_id = req.body.user_id; // Get user_id from request body

    if (!user_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    if (!title || !description || !quantity || !type_marche_id) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        receivedData: req.body,
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO purchase_requests (user_id, title, description, quantity, type_marche_id, status_id) VALUES (?, ?, ?, ?, ?, 1)",
      [user_id, title, description, quantity, type_marche_id]
    );

    res.status(201).json({
      status: "success",
      data: {
        id: result.insertId,
        title,
        description,
        quantity,
        type_marche_id,
        status_id: 1,
      },
    });
  } catch (err) {
    console.error("Error creating purchase request:", err);
    res.status(500).json({
      status: "error",
      message: "Error creating purchase request",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
      details: err,
    });
  }
};

module.exports = { createPurchaseRequest };
