const express = require("express");
const http = require("http");
const session = require("express-session");
const { Server } = require("socket.io");
const db = require("./db");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
}));
app.use(express.static("public"));

/* LOGIN API */
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=? AND password=?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.send("Database Error");

        if (result.length > 0) {
            req.session.user = email;
            res.send("success");
        } else {
            res.send("Invalid Email or Password");
        }
    });
});

/* AUTH MIDDLEWARE */
function checkLogin(req, res, next) {
    if (req.session.user) next();
    else res.redirect("/login.html");
}

/* Protect real-time page */
app.get("/", checkLogin, (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

/* SOCKET.IO */
io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("newEvent", (data) => {
        const sql = "INSERT INTO events (message) VALUES (?)";
        db.query(sql, [data], (err) => {
            if (!err) {
                io.emit("syncEvent", data);
            }
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(3000, () => {
    console.log("🚀 http://localhost:3000/login.html");
});