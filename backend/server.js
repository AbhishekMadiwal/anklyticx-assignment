const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());


app.post("/check-email", (req, res) => {
  const { email } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ exists: false, message: "Server error" });
    }

    res.status(200).json({ exists: results.length > 0 });
  });
});


app.post("/register", (req, res) => {
  const { name, email, address, city, state, zip } = req.body;

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const insertQuery =
      "INSERT INTO users (name, email, address, city, state, zip) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      insertQuery,
      [name, email, address, city, state, zip],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Error inserting user:", insertErr);
          return res.status(500).json({ message: "Server error" });
        }
        res.status(200).json({ message: "User registered successfully" });
      }
    );
  });
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
