# IRCTC-ROLE-BASED-TICKET-BOOKING-API

This is nodejs/express api which implements irctc type ticket booking system. It provides a role based access control to its users.

- web server - NodeJS/ ExpressJS <br>
- Database - PostgreSQL<br>
- ORM - Sequelize<br>

## DATABASE SCHEMAS

Tables<br>
-User, Train, Booking

- User<br>
  -username : String<br>
  -email: String<br>
  -password: String<br>
  -role: Enum("admin", "user")<br>

- Train
  -train_num: String<br>
  -src : String<br>
  -dest : String<br>
  -avl_seats: int<br>

- Booking
  -booking_id: int<br>
  -username:String<br>
  -train_num :String<br>
  -booking_time: String<br>

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

- `POST /getticket` - Get ticket details

  - Request { booking_id }(int), token
  - Response {booking}

## INSTALLATION AND RUNNING

-clone the repository<br>
-Run `npm install`<br>
-Run `nodemon server.js` or `node server.js`<br>
