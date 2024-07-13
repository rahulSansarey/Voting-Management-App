const express = require("express");
// Creating an instance of express as app
const app = express();
require("dotenv").config();

// Import Db from db.js
const db = require("./db");

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;



// Imporrting Routes
const userRoutes = require ("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");


app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

app.listen(PORT, () => {
  console.log("server is running on port", { PORT });
});
