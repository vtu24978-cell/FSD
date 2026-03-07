const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(express.static("public"));

/* MySQL Connection */
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "manju",
    database: "student_db"
});

db.connect(err => {
    if (err) {
        console.log("❌ Database Error:", err);
    } else {
        console.log("✅ MySQL Connected");
    }
});

/* ==============================
   GET STUDENTS (SORT + FILTER)
   ============================== */
app.get("/students", (req, res) => {
    const { sort, course } = req.query;

    let sql = "SELECT * FROM students";
    let conditions = [];

    if (course) {
        conditions.push(`course='${course}'`);
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    if (sort === "name") {
        sql += " ORDER BY name";
    } else if (sort === "dob") {
        sql += " ORDER BY dob";
    }

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.json(results);
    });
});

/* ==============================
   COUNT STUDENTS PER DEPARTMENT
   ============================== */
app.get("/count", (req, res) => {
    const sql = `
        SELECT course, COUNT(*) AS total
        FROM students
        GROUP BY course
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.json(results);
    });
});

/* Server */
app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000/dashboard.html");
});