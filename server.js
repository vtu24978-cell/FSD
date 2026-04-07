const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "manju",
    database: "order_db"
});

db.connect(() => console.log("✅ MySQL Connected"));

/* Order History */
app.get("/orders", (req, res) => {
    const sql = `
        SELECT c.name, p.product_name, o.quantity,
               p.price, (o.quantity*p.price) AS total, o.order_date
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON o.product_id = p.product_id
        ORDER BY o.order_date DESC
    `;
    db.query(sql, (err, result) => res.json(result));
});

/* Highest Value Order */
app.get("/highest", (req, res) => {
    const sql = `
        SELECT c.name, (o.quantity*p.price) AS total
        FROM orders o
        JOIN customers c ON o.customer_id=c.customer_id
        JOIN products p ON o.product_id=p.product_id
        ORDER BY total DESC LIMIT 1
    `;
    db.query(sql, (err, result) => res.json(result[0]));
});

/* Most Active Customer */
app.get("/active", (req, res) => {
    const sql = `
        SELECT c.name, COUNT(*) AS orders_count
        FROM orders o
        JOIN customers c ON o.customer_id=c.customer_id
        GROUP BY o.customer_id
        ORDER BY orders_count DESC LIMIT 1
    `;
    db.query(sql, (err, result) => res.json(result[0]));
});

app.listen(3000, () =>
    console.log("🚀 Server running at http://localhost:3000")
);