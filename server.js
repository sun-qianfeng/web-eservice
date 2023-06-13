//Express is for building the Rest apis
const express = require("express");
const nocache = require('nocache');

//create an Express app
const app = express();

//logger npmlog
const logger = require("npmlog");


app.use(nocache());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./app/routes/users.routes.js")(app);
require("./app/routes/booking.routes.js")(app);
require("./app/routes/rooms.routes.js")(app);
require("./app/routes/documents.routes.js")(app);

app.use(express.static('static'));

// set port, listen for requests
const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
