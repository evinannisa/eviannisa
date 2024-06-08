require("dotenv").config;
const express = require("express");
const cors = require("cors");
const path = require("path");

const contactRoute = require("./route/contactRoute");

const app = express();

// creating the middleware
app.use(express.json());
app.use(cors());

// Middleware untuk menyajikan file statis dari folder build
app.use(express.static(path.join(__dirname, "../client/build")));

// Semua request yang tidak dikenali oleh server akan mengembalikan index.html
app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// app.use("/", contactRoute);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server listing to port 5000 only`));
