module.exports = app => {
    const rooms = require("../controllers/rooms.controller.js");
    const router = require("express").Router();
  
    // Create a new room
    //router.post("/", hotelrooms.create);
  
    // Retrieve all rooms
    // router.get("/", hotelrooms.findAll);
  
    // Retrieve a single hotelrooms with roomid
  router.get("/:email", rooms.findAllAvaRooms);
  router.get("/", rooms.findAll);
  router.get("/OneRoom/:id", rooms.findOne);
  router.put("/UpdateRoom/:id", rooms.update);
  
    // Update an airport with code
    // router.put("/:RoomId", hotelrooms.update);
  
    // Delete an airport with code
    //router.delete("/:code", airports.delete);
  
    app.use('/api/rooms', router);
  };