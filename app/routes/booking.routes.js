module.exports = app => {
  const booking = require("../controllers/booking.controller.js");
  // const reserve = require("../controllers/reserve.controller.js");
  
    var router = require("express").Router();

   router.get("/:email", booking.findBookingByEmail);
    router.post("/", booking.create);
    router.get("/", booking.findAll);
    router.get("/OneBooking/:id", booking.findOne);
    router.put("/update/:id", booking.update);
    router.delete("/delete/:id", booking.delete);
    app.use('/api/bookings', router);
  };