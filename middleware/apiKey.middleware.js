require("dotenv").config();

//    CHECKS IF BOTH THE KEYS ARE SAME OR NOT
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.header("x-api-key");
  const validApiKey = process.env.ADMIN_API_KEY;
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(403).send({ error: "Invalid API Key" });
  }
  console.log("Api key verified");
  next();
};
module.exports = apiKeyMiddleware;
