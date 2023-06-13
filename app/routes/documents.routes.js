module.exports = app => {
    const documents = require("../controllers/documents.controller.js");
  
    var router = require("express").Router();
  
    // Create a new document
    router.post("/", documents.create);
  
    // Retrieve a single document with id
    router.get("/:id([0-9]+)", documents.findOne);
  
    // Retrieve all docs
    router.get("/", documents.findAll);

    app.use('/api/documents', router);
  };