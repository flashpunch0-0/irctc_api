const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");
const Booking = require("../models/booking");
const Train = require("../models/train");

// const bookTicket = async (req, res) => {
//   const { train_num } = req.body;
//   const token = req.header("Authorization")?.split(" ")[1];

//   if (!token)
//     return res
//       .status(401)
//       .json({ message: "No token provided; access denied" });

//   const decrypted = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   // verify token
//   if (!decrypted) return res.status(401).json({ message: "Invalid Token" });
//   console.log(decrypted);
//   const train = await Train.findOne({ where: { train_num: train_num } });

//   //   check if train seat availability then create a booking data
//   if (train.avl_seats > 0) {
//     train.avl_seats = train.avl_seats - 1;
//     train.save();

//     // creating a booking data
//     const booking = await Booking.create({
//       train_num: train_num,
//       booking_time: new Date(),
//       //  using username from decrypted data
//       username: decrypted.username,
//     });
//     res
//       .status(201)
//       .json({ message: "Ticket booked successfully", ticket_details: booking });
//   } else {
//     res.status(400).json({ message: "No seats available" });
//   }
// };
const bookTicket = async (req, res) => {
  const { train_num } = req.body;
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "No token provided; access denied" });

  try {
    const decrypted = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decrypted) return res.status(401).json({ message: "Invalid Token" });

    // transaction
    const t = await sequelize.transaction();

    // executing the whole code in a try and catch block
    try {
      // lock
      const train = await Train.findOne({
        where: { train_num },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!train) {
        await t.rollback();
        return res.status(404).json({ message: "Train not found" });
      }

      // seat check
      if (train.avl_seats <= 0) {
        await t.rollback();
        return res.status(400).json({ message: "No seats available" });
      }

      // Decrement seat count
      train.avl_seats -= 1;
      await train.save({ transaction: t });

      // Create booking
      const booking = await Booking.create(
        {
          train_num,
          booking_time: new Date(),
          username: decrypted.username,
        },
        { transaction: t }
      );

      // Commit the transaction
      await t.commit();

      res.status(201).json({
        message: "Ticket booked successfully",
        ticket_details: booking,
      });
    } catch (error) {
      // Rollback becuse error
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: "Booking failed, try again later" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// get the ticket detail
const getTicketDetail = async (req, res) => {
  const { booking_id } = req.body;
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "No token provided; access denied" });

  const decrypted = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // verify token
  if (!decrypted) return res.status(401).json({ message: "Invalid Token" });
  const ticket = await Booking.findOne({ where: { booking_id: booking_id } });
  return res.status(200).json({ message: ticket });
};
module.exports = {
  bookTicket,
  getTicketDetail,
};
