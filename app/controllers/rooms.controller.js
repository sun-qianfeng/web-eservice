const RoomClass = require("../models/rooms.model.js");


// Retrieve all rooms sort by roomid
exports.findAll = (req, res) => {
  const sortBy = req.query.sortBy || 'RoomId';
  RoomClass.getAll(sortBy, (err, hotelrooms) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving hotelrooms."
      });
    } else {
      res.send(hotelrooms);
    }
  });
};

// Find a single hotelroom by primary key (RoomId)
exports.findOne = (req, res) => {
  const RoomId = req.params.id;
  RoomClass.findOne(RoomId, (err, hotelroom) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "Hotelroom not found."
        });
      } else {
        res.status(500).send({
          message: "Error retrieving hotelroom"
        });
      }
    } else {
      if (!hotelroom) {
        res.status(404).send({
          message: "Hotelroom not found."
        });
      } else {
        res.send(hotelroom);
      }
    }
  });
};

// Update a hotelroom by roomid
exports.update = (req, res) => {
  console.log("inside update:"+req.params.RoomId);
  const updatedHotelroom = new RoomClass(req.body);

  // Validate the hotelroom data

  RoomClass.update(req.params.id, updatedHotelroom, (err, hotelroom) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "Hotelroom not found."
        });
      } else if (err.code === "ER_DUP_ENTRY") {
        res.status(409).send({
          message: "Hotelroom already exists."
        });
      } else {
        res.status(500).send({
          message: err.message || "An error occurred while updating the hotelroom."
        });
      }
    } else {
      if (!hotelroom) {
        res.status(404).send({
          message: "Hotelroom not found."
        });
      } else {
        res.send(hotelroom);
      }
    }
  });
}


exports.findAllAvaRooms = (req, res) => {
    console.log("inside execifauth retrive rooms controller");
    // console.log(JSON.stringify(req.headers)); // debugging only
    if (req.headers['x-auth-checkin'] === undefined || req.headers['x-auth-checkout'] == undefined) {
        console.log("no x-auth-* headers received");
        res.status(403).send({
            message: 'Authentication required but not provided'
        });
        return;
    }
    let chi = req.headers['x-auth-checkin'];
    let cho = req.headers['x-auth-checkout'];
    console.log(chi+cho);
    RoomClass.findAvaRooms(chi,cho, (err, user) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                    message: 'Authentication invalid'
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving rooms with checkindate " + chi
                });
            }
        } else {
            // console.log('User found: ' + JSON.stringify(user));
            res.status(200).send(user);

        }
    });

}