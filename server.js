const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "manju", // change if needed
    database: "login"
});

db.connect((err) => {
    if (err) {
        console.log("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL");
    }
});
// ================= LOGIN API =================
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=? AND password=?";

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            console.log("❌ EXACT SQL ERROR:", err); // 👈 IMPORTANT
            return res.status(500).send("Database Error");
        }

        console.log(result); // 👈 DEBUG

        if (result.length > 0) {
            res.send("success");
        } else {
            res.send("Invalid Email or Password");
        }
    });
});

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
    console.log("🚀 Server running at http://localhost:3000/login.html");
    console.log("🚀 Server running at http://localhost:3000/login.feedback.html");
});