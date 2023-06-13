module.exports = app => {
  const user = require("../controllers/users.controller.js");
  
  var router = require("express").Router();

  
    // login path
  router.get("/", user.execIfAuthValid);
  router.get("/AllUsers", user.findAll);
  router.get("/:email", user.findOne);
  router.get("/OneUser/:id", user.findUserById);
  router.put("/Update/:id", user.update);
  router.delete("/:id", user.delete);
  router.post("/", user.create);
  app.use('/api/users', router);
};