const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");
const Booking = require("../models/booking");
const Train = require("../models/train");

const bookTicket = async (req, res) => {
  const { train_num } = req.body;
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "No token provided; access denied" });

  const decrypted = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // verify token
  if (!decrypted) return res.status(401).json({ message: "Invalid Token" });
  console.log(decrypted);
  const train = await Train.findOne({ where: { train_num: train_num } });

  //   check if train seat availability then create a booking data
  if (train.avl_seats > 0) {
    train.avl_seats = train.avl_seats - 1;
    train.save();
    const booking = await Booking.create({
      train_num: train_num,
      booking_time: new Date(),
      //  using username from decrypted data
      username: decrypted.username,
    });
    res.status(201).json({ message: "Ticket booked successfully" });
  } else {
    res.status(400).json({ message: "No seats available" });
  }
};

module.exports = {
  bookTicket,
};
