const express = require("express");
const router = express.Router();
const db = require("./db"); 


router.post("/", (req, res) => {
  const { name, email, address, city, state, zip } = req.body;

  const sql = "INSERT INTO users (name, email, address, city, state, zip) VALUES (?, ?, ?, ?, ?, ?)";
  
  db.query(sql, [name, email, address, city, state, zip], (err, result) => {
    if (err) {
      console.error("Database insert error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "User registered successfully!" });
  });
});

module.exports = router;
