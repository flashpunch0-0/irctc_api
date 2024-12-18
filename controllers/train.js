const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");
const Train = require("../models/train");
const { Op } = require("sequelize");

const addTrain = async (req, res) => {
  const { train_num, source, destination, availableSeats } = req.body;
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "No token provided; access denied" });

  const decrypted = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // verify token
  if (!decrypted) return res.status(401).json({ message: "Invalid Token" });

  //  create a train data
  const train = await Train.create({
    train_num: train_num,
    src: source,
    dest: destination,
    avl_seats: availableSeats,
  })
    .then((train) => {
      res
        .status(201)
        .json({ message: `${train.train_num} created successfully` });
    })
    .catch((err) => {
      res.status(400).json({ message: "Error adding train" });
    });
};

// fetch train
const getTrains = async (req, res) => {
  const { source, destination } = req.body;
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "No token provided; access denied" });
  const decrypted = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decrypted) return res.status(401).json({ message: "Invalid Token" });
  // findall
  const trains = await Train.findAll({
    where: {
      src: source,
      dest: destination,
      avl_seats: {
        [Op.gt]: 0,
      },
    },
  });
  if (trains.length < 1) {
    return res.status(400).json({ message: "No trains available" });
  }
  res.status(200).json({ message: trains });
};

const updateSeats = async (req, res) => {
  const { train_num, availableSeats } = req.body;
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "No token provided; access denied" });
  const decrypted = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decrypted) return res.status(401).json({ message: "Invalid Token" });
  const train = await Train.findOne({ where: { train_num: train_num } });
  if (!train) {
    return res
      .status(401)
      .json({ message: `Train with number ${train_num} not found` });
  }
  //  update the seats
  train.avl_seats = availableSeats;
  train.save();
  res.status(200).json({ message: "Seats updates successfully" });
};

module.exports = {
  addTrain,
  getTrains,
  updateSeats,
};
