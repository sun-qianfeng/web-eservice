const db = require("./db.js");

// constructor
const RoomClass = function (hotelroom) {
  this.RoomId = hotelroom.RoomId;               
  this.RoomType = hotelroom.RoomType;
  this.PricePerNight = hotelroom.PricePerNight;
  this.RoomStatus = hotelroom.RoomStatus;
};

//create a user
RoomClass.create = (newRoom, result) => {
  db.query("INSERT INTO users SET ?", newRoom, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { UserEmail: res.UserEmail, ...newRoom });
    result(null, { UserEmail: res.UserEmail, ...newRoom });
  });
};


//return one user by email
RoomClass.findByUserEmail = (UserEmail, result) => {
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
RoomClass.findByEmailBooking = (email,result) => {
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

//update a user 
RoomClass.update = (RoomId, updatedHotelroom, result) => {
  db.query(
    "UPDATE hotelrooms SET RoomType = ?, PricePerNight = ?, RoomStatus = ? WHERE RoomId = ?", 
    [updatedHotelroom.RoomType, updatedHotelroom.PricePerNight, updatedHotelroom.RoomStatus, RoomId],  
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated hotelroom: ", { RoomId: RoomId, ...updatedHotelroom });
      result(null, { RoomId: RoomId, ...updatedHotelroom });
    }
  );
};


//delete a user
RoomClass.remove = (email, result) => {
  
  db.query(`DELETE FROM users WHERE UserEmail = "${email}"`, (err, res) => {
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

    console.log("deleted user with email: ", email);
    result(null, res);
  });
};

RoomClass.findAvaRooms = (chi,cho, result) => {
  console.log("inside findavarooms model：" + chi + cho);
  let queryava = db.format(`select * from hotelrooms where RoomId not in(select RoomId from bookings where (('${chi}'<CheckOutDate AND '${chi}'>CheckInDate) ||('${cho}'<CheckOutDate AND '${cho}'>CheckInDate) || ('${chi}'<CheckInDate AND '${cho}'>CheckOutDate)))`);
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
RoomClass.getAll = (sortBy, result) => {
  const query = db.format("SELECT * FROM hotelrooms ORDER BY ??", [sortBy]);
  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, res);
  });
};



RoomClass.findOne = (RoomId, result) => {
  const query = db.format("SELECT * FROM hotelrooms WHERE RoomId = ?", [RoomId]);
  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
    } else {
      result({ kind: "not_found" }, null);
    }
  });
};
module.exports = RoomClass;


  