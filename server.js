const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "manju",
    database: "payment_db"
});

db.connect(() => console.log("✅ MySQL Connected"));

/* Payment API */
app.post("/pay", (req, res) => {
    const { userId, merchantId, amount } = req.body;

    db.beginTransaction(err => {
        if (err) return res.send("Transaction Error");

        const deductUser =
            "UPDATE users SET balance = balance - ? WHERE user_id = ?";

        db.query(deductUser, [amount, userId], err => {
            if (err) {
                return db.rollback(() => res.send("Payment Failed"));
            }

            const addMerchant =
                "UPDATE merchants SET balance = balance + ? WHERE merchant_id = ?";

            db.query(addMerchant, [amount, merchantId], err => {
                if (err) {
                    return db.rollback(() =>
                        res.send("Payment Failed – Rolled Back")
                    );
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() =>
                            res.send("Commit Failed")
                        );
                    }
                    res.send("✅ Payment Successful");
                });
            });
        });
    });
});

app.listen(3000, () =>
    console.log("🚀 Server running at http://localhost:3000")
);