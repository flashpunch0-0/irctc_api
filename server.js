const express = require("express");
const cors = require("cors");
const db = require("./db");

require("dotenv").config();
const app = express();
app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 3010;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
    process.exit(1);
  } else {
    console.log("PostgreSQL connected successfully at:", res.rows[0].now);
  }
});
