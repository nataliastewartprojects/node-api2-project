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

//-->>GET POST BY ID AND COMMENTS
router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then((comment) => {
      if (comment.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(comment);
      }
    })
    .catch((error) => {
      console.log(error, "status 500");
      res
        .status(500)
        .json({ error: "The comment information could not be retrieved." });
    });
});

//-->>POST (ADD a Post)
router.post("/", (req, res) => {
  const post = req.body;

  if (!post.title || !post.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    try {
      Posts.insert(post);
      res.status(201).json(post);
    } catch {
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    }
  }
});

//-->>POST COMMENT (isert a new comment)
router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  const comment = req.body;

  if (!comment.text) {
    res.status(400).json({ message: "no text" });
  } else {
    Posts.insertComment({ post_id: id, ...comment }).then((comment) => {
      if (comment === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      } else {
        try {
          res.status(201).json({ id: comment.id, post_id: id, ...req.body });
        } catch {
          console.log(error, "500 error");
          res.status(500).json({
            error: "There was an error while saving the post to the database",
          });
        }
      }
    });
  }
});

//-->> DELETE POST/:id

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then((post) => {
      if (post && post > 0) {
        res.status(200).json({ message: "The post has been deleted" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error removing the post",
      });
    });
});

//-->>UPDATE POST/:id - PUT

router.put("/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for the post" });
  } else {
    Posts.update(req.params.id, req.body)
      .then((item) => {
        if (item) {
          res.status(200).json({ ...req.body, id: req.params.id });
        } else {
          res.status(404).json({
            message: "The post with the speciefied ID does not exist",
          });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: "The post informationd could not be modified." });
      });
  }
});

module.exports = router;
