const UserClass = require("../models/booking.model");
const { createHash } = require('crypto');

exports.hash = (string) => {
    return createHash('sha256').update(string).digest('hex');
}

exports.execIfAuthValid = (req, res, Role, callIfAuth) => {
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
    let passwordHash = exports.hash(password);
    console.log("email: " + email + ", password: " + password + ", passHash: " + passwordHash);    //
    UserClass.findByUserEmail(email, (err, user) => {
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
                delete user.password; // for an abundance of security, don't send the password back, it's not needed anyway
                if (Role !== undefined && Role !== null) { // check role only if one was provided
                    console.log("user role:"+user.Role);
                    if (user.Role == Role) {
                        callIfAuth(req, res, user); // *the* call
                    } else {
                        res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                            message: 'Authentication invalid'
                        });
                    }
                } else {
                    callIfAuth(req, res, user); // *the* call
                }
            } else {
                res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                    message: 'Authentication invalid'
                });
            }
        }
    });

}


