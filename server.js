require("dotenv").config;
const express = require("express");
const cors = require("cors");
const path = require("path");

const contactRoute = require("./route/contactRoute");

const app = express();

// creating the middleware
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "client", "public")));

// app.get("/", (req, res) => {
//    res.send("Hello, World!");
// });

app.get("/client", (req, res) => {
   res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.use("/", contactRoute);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server listing to port 5000 only`));
