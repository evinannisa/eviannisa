require("dotenv").config;
const express = require("express");
const cors = require("cors");
const path = require("path");

const contactRoute = require("./route/contactRoute");

const app = express();

// creating the middleware
app.use(express.json());
app.use(cors());

// Melayani file statis dari client/public
app.use(express.static(path.join(__dirname, "client", "public")));

// Route untuk melayani index.html dari client/public
app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

app.use("/api", contactRoute);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server listing to port 5000 only`));
