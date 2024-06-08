require("dotenv").config;
const express = require("express");
const cors = require("cors");
const path = require("path");

const contactRoute = require("./route/contactRoute");

const app = express();

// creating the middleware
app.use(express.json());
app.use(cors());

// Middleware untuk menyajikan file statis dari folder public
app.use(express.static(path.join(__dirname, "public")));

// Middleware untuk menyajikan file statis dari hasil build aplikasi React
app.use(express.static(path.join(__dirname, "client/build")));

// Route untuk melayani halaman utama dari aplikasi React
app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// app.use("/", contactRoute);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server listing to port 5000 only`));
