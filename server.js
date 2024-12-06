const express = require("express");
const cors = require("cors");
const { registerUser, loginUser } = require("./controllers/auth");
const { addTrain } = require("./controllers/train");
const sequelize = require("./config/db");
const apiKeyMiddleware = require("./middleware/apiKey.middleware");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3010;

sequelize
  .sync()
  .then(() => {
    console.log("Tables created!");
  })
  .catch((err) => console.error("Error creating tables: ", err));

// routes
app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/admin/addtrain", apiKeyMiddleware, addTrain);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
