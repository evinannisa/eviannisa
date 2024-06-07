require("dotenv").config;
const express = require("express");
const cors = require("cors");
const path = require("path");

const contactRoute = require("./route/contactRoute");

const app = express();

// creating the middleware
app.use(express.json());
app.use(cors());

// Static file serving for main public directory
app.use(express.static(path.join(__dirname, 'public')));

// Static file serving for submodule
app.use('/submodule', express.static(path.join(__dirname, 'submodule')));

// Route for serving index.html from submodule
app.get('/submodule', (req, res) => {
  res.sendFile(path.join(__dirname, 'submodule', 'index.html'));
});

app.use("/", contactRoute);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server listing to port 5000 only`));
