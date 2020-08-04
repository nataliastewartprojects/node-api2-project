const express = require("express");
const Posts = require("../data/db.js"); //<< update the path
const router = express.Router();

router.get("/", (req, res) => {
  //all the database methods returns a promise

  const query = req.query;

  //-->GET POSTS
  Posts.find(query) //dont forget to pass a obj here
    .then((hubs) => {
      res.status(200).json({ data: hubs, parameters: req.query });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

//-->>GET POST BY ID

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

module.exports = router;
