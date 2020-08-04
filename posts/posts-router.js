const express = require("express");
const Posts = require("../data/db.js"); //<< update the path
const router = express.Router();

router.get("/", (req, res) => {
  //all the database methods returns a promise

  const query = req.query;

  Posts.find(query) //dont forget to pass a obj here
    .then((hubs) => {
      res.status(200).json({ data: hubs, parameters: req.query });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
