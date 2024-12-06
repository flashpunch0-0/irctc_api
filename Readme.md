# IRCTC-ROLE-BASED-TICKET-BOOKING-API

This is nodejs/express api which implements irctc type ticket bokking system. It provides a role based access control to its users.
web server - NoedJS/ ExpressJS <br>
Database - PostgreSQL
ORM - Sequqlize

## DATABASE SCHEMAS

Tables
-User, Train, Booking

User
-username : String
-email: String
-password: String
role: Enum("admin", "user")

Train
-train_num: String
-src : String
-dest : String
-avl_seats: int

Booking
-booking_id: int
-username:String
-train_num :String
-booking_time: String

## API ROUTES

### AUTH

- `POST /register` - To create a new user

  - Request.body should contain {username, email, password, role}
  - Respone is {message}

- `POST /login` - To login to the system
  - Request.body should contain {username, password}
  - Response is {token}

### TRAINS

- `POST /admin/addtrain` - Only admin can add train

  - Request { train_num, source, destination, availableSeats }, token, api_key
  - Response {message}

- `POST /admin/gettrain` - get trains and number of seats between src and destination

  - Request { source, destination }, token, api_key
  - Response trains[]

- `PUT /admin/updateseats` - Update seats in a train
  - Request { train_num, availableSeats }, token, API_KEY
  - Response {message}

### BOOKING

- `POST /bookticket` - Books ticket only using the train_num. Verifies the username and assigns the ticket to user
  - Request { train_num, availableSeats }, token
  - Response {message}

` `POST /getticket` - Get ticket details - Request { booking_id }(int), token - Response {booking}

## INSTALLATION AND RUNNING

-clone the repository
-Run `npm install`
-Run `nodemon server.js` or `node server.js`
