const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "manju",
  database: "audit_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// Insert employee
app.post("/add", (req, res) => {
  const { name, department, salary } = req.body;
  const sql = "INSERT INTO employees (emp_name, department, salary) VALUES (?, ?, ?)";
  db.query(sql, [name, department, salary], err => {
    if (err) throw err;
    res.send("Employee added & logged successfully");
  });
});

// Update salary
app.post("/update", (req, res) => {
  const { id, salary } = req.body;
  const sql = "UPDATE employees SET salary=? WHERE emp_id=?";
  db.query(sql, [salary, id], err => {
    if (err) throw err;
    res.send("Salary updated & logged successfully");
  });
});

// View audit report
app.get("/report", (req, res) => {
  db.query("SELECT * FROM daily_activity_report", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});