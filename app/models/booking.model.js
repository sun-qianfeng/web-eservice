const db = require("./db.js");

// constructor
const BookingClass = function (booking) {
  this.UserId = booking.UserId;
  this.RoomId = booking.RoomId;
  this.CheckInDate = booking.CheckInDate;
  this.CheckOutDate = booking.CheckOutDate;
  this.BookingStatus = booking.BookingStatus;
  this.BookingBill = booking.BookingBill;
  this.PaymentStatus = booking.PaymentStatus;
};
    // create a hotel booking
BookingClass.create = (newBooking, result) => {
  console.log("inside booking model:"+ newBooking.UserId);
    db.query("INSERT INTO bookings SET ?", newBooking, (err, res) => {
    if (err) {
    console.log("error: ", err);
    result(err, null);
    return;
    }
    console.log("created booking: ", { BookingId: res.BookingId, ...newBooking });
    result(null, { BookingId: res.BookingId, ...newBooking });
    });
  };
  

//return one user by email
BookingClass.findByUserEmail = (UserEmail, result) => {
  console.log("inside findbyuser email model:"+UserEmail);
  //  db.query(`SELECT * FROM users WHERE UserEmail = "admin@abbotthotel.com"`, (err, res) => {

   db.query(`SELECT * FROM users WHERE UserEmail = "${UserEmail}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found user with the email
    result({ kind: "not_found" }, null);
  });
};

// return all users
BookingClass.findBookByEmail = (email,result) => {
//  select * from hotelrooms where ( (RoomId NOT IN (select RoomId from bookings where ((@checkout<CheckOutDate AND @checkout>CheckInDate) ||(@checkin<CheckOutDate AND @checkin>CheckInDate)))));
  var query = db.format(`select * from bookings b join users u on b.userId=u.userId where u.UserEmail ="${email}"`);
  // var query = db.format(`SELECT * FROM bookings WHERE BookingId="1"`);
 
  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
  
    result(null, res);
    // console.log("inside findbyEmailBooking model:"+res);
  });
};

//delete a user
BookingClass.remove = (id, result) => {
  
  db.query(`DELETE FROM bookings WHERE BookingId = "${id}"`, (err, res) => {
    if (err) {
      console.log("error: ", err); 
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found user with the email
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted booking with bookingid: ", id);
    result(null, res);
  });
};

BookingClass.findAvaRooms = (chi,cho, result) => {
  console.log("inside findavarooms model：" + chi + cho);
  let queryava = db.format(`select * from hotelrooms where RoomId not in(select RoomId from bookings where (('${chi}'<CheckOutDate AND '${chi}'>CheckInDate) ||('${cho}'<CheckOutDate AND '${cho}'>CheckInDate) || ('${chi}'>=CheckInDate AND '${cho}'<=CheckOutDate)))`);
  db.query(queryava, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
      //  console.log(res);
       if (res.length) {
         console.log(res.length);
        // console.log("found user: ", res);
      result(null, res);
      return;
       }
       
        result({ kind: "not_found" }, null);

  
  });
};

BookingClass.getAll = (sortBy,result) => {
  /* var sql = "SELECT * FROM todos ORDER BY ??";
  var inserts = [sortOrder];
  var query = db.format(sql, inserts); */
  var query = db.format("SELECT * FROM bookings ORDER BY ??", [sortBy]);
  // console.log("inside model getall:"+query);
 
  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("Airports: ", res);
    result(null, res);
    console.log("inside model db.query"+res);
  });
};

BookingClass.findById = (id, result) => {
  // console.log("inside model:"+ codes);
  // FIXME: prevent SQL injection
  // db.query(`SELECT * FROM airports WHERE codes = ${code}`, (err, res) => {
   db.query(`SELECT * FROM bookings WHERE BookingId = "${id}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found airport: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found ToDO with the id
    result({ kind: "not_found" }, null);
  });
};


BookingClass.updateById = (bookingId, booking, result) => {
  db.query(
    "UPDATE bookings SET CheckInDate = ?, CheckOutDate = ?, BookingStatus = ?, BookingBill = ?, PaymentStatus = ? WHERE BookingId = ?",
    [booking.CheckInDate, booking.CheckOutDate, booking.BookingStatus, booking.BookingBill, booking.PaymentStatus, bookingId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      //problem affectedRows
      if (res.affectedRows == 0) {
        // not found todo with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated booking: ", { BookingId: bookingId, ...booking });
      result(null, { BookingId: bookingId, ...booking });
    }
  );
};
module.exports = BookingClass;


  