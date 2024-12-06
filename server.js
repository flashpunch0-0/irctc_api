const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const { registerUser } = require("./controllers/auth");
const sequelize = require("./config/db");

require("dotenv").config();
const app = express();
app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 3010;
sequelize
  .sync({ force: true }) // Set to `true` only for development
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Database sync failed:", err));

// routes
app.post("/register", registerUser);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
