const BookingClass = require("../models/booking.model");

// Create and save a new booking
exports.create = (req, res) => {
    // Create a booking
    console.log("inside controller create:"+req.body.UserId);
    const booking = new BookingClass({
        UserId: req.body.UserId,
        RoomId:req.body.RoomId,
        CheckInDate: req.body.CheckInDate,
        CheckOutDate: req.body.CheckOutDate,
        BookingBill: req.body.BookingBill,
        PaymentStatus: req.body.PaymentStatus,
        BookingStatus:req.body.BookingStatus

    });

    // Save the booking in the database
    BookingClass.create(booking, (err, data) => {
        console.log("create booking:"+booking);
        console.log(err);
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the booking.",
            });
        } else {
            res.status(201).send(data);
        }
    });
};


// Find a single booking by ID
exports.findOne = (req, res) => {
    console.log("inside booking controller:"+req.params.id);
    BookingClass.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found user with Email ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving user with Email ${req.params.id}.`
                });
            }
        } else res.status(200).send(data);
    });
};

// Update a booking by ID
exports.update = (req, res) => {
    
    const updateBooking = new BookingClass(req.body);
    BookingClass.updateById(
        req.params.id,
        updateBooking,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found booking with codes ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating booking with id " + req.params.id
                    });
                }
            } else res.status(200).send(data);
        }
    );
};

// Delete a booking by ID
exports.delete = (req, res) => {
    BookingClass.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found booking with ID ${ req.params.BookingId }.,`
    });
} else {
    res.status(500).send({
        message: "Could not delete booking with ID " + req.params.BookingId,
    });
}
    } else {
    res.status(200).send({ message: true });
}
    });
};



exports.findAll = (req, res) => {
    const sortBy = req.query.sortBy ? req.query.sortBy : "BookingId";

    BookingClass.getAll(sortBy,(err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving todos."
            });
        else res.status(200).send(data);
    });
};


exports.findBookingByEmail = (req, res) => {
    // console.log("inside controller findone:"+req.params.codes);
    BookingClass.findBookByEmail(req.params.email, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found airport with codes ${req.params.codes}.`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving airport with codes ${req.params.codes}.`
                });
            }
        } else res.status(200).send(data);
    });
};