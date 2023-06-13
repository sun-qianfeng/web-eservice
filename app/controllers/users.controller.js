const UserClass = require("../models/users.model");
const BookingClass = require("../models/booking.model");
const Auth = require("../utils/auth");
exports.create = (req, res) => {

        // Create a user
        const user = new UserClass({
            UserEmail: req.body.UserEmail,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            UserTel: req.body.UserTel,
            UserAddress: req.body.UserAddress,
            Password: Auth.hash(req.body.Password),
            Role:req.body.Role
           

        });

        // Save user in the database
        UserClass.create(user, (err, data) => {
            console.log(err);
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the user."
                });
            else res.status(201).send(data);
        });


};

//retrive rooms
exports.execIfAuthValid = (req, res, callIfAuth) => {
    // console.log(JSON.stringify(req.headers)); // debugging only
    if (req.headers['x-auth-email'] === undefined || req.headers['x-auth-password'] == undefined) {
        console.log("no x-auth-* headers received");
        res.status(403).send({
            message: 'Authentication required but not provided'
        });
        return;
    }
    let email = req.headers['x-auth-email'];
    let password = req.headers['x-auth-password'];
    let passwordHash = Auth.hash(password);
    console.log("email: " + email + ", password: " + password + ", passHash: " + passwordHash);    //
    BookingClass.findByUserEmail(email, (err, user) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                    message: 'Authentication invalid'
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving user with email " + req.params.UserEmail
                });
            }
        } else {
            console.log('User found: ' + JSON.stringify(user));
            console.log(user.Password+"  "+passwordHash );
            if (user.Password == passwordHash) {
                console.log("user password:" +user.Password);
                 console.log('User found: ' + JSON.stringify(user));
                res.status(200).send(user);
            } else {
                res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                    message: 'Authentication invalid'
                });
            }
        }
    });

}

//Find a single user by the email
exports.findOne = (req, res) => {
    console.dir("insdie find one controller");
    UserClass.findByEmailId(req.params.email, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found user with Email ${req.params.UserEmail}.`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving user with Email ${req.params.UserEmail}.`
                });
            }
        } else
            res.status(200).send(data);
    });
};


// Retrieve all Airports from the database (with condition).
exports.findAll = (req, res) => {
    const sortBy = req.query.sortBy ? req.query.sortBy : "userId";

    UserClass.getAll(sortBy,(err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving todos."
            });
        else res.status(200).send(data);
    });
};

exports.findUserById = (req, res) => {
    // console.log("inside controller findone:"+req.params.codes);
    UserClass.findById(req.params.id, (err, data) => {
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



//Update a airport by codes
exports.update = (req, res) => {
    
    const updateUser = new UserClass(req.body);
    UserClass.updateById(
        req.params.id,
        updateUser,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found user with userid ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating user with userid " + req.params.id
                    });
                }
            } else res.status(200).send(data);
        }
    );
};



exports.delete = (req, res) => {
    UserClass.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found airport with codes ${req.params.codes}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete airport with codes " + req.params.codes
                });
            }
        } else res.status(200).send({ message: true });
    });
};
