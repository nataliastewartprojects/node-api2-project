const express = require("express");
const server = express();
const postsRouter = require("./posts/posts-router.js");

server.use(express.json()); //middleware to read JSON

//-- tells to the Server to use the Router
server.use("/api/posts", postsRouter);

//Runs the server--//
const port = 8000;
server.listen(port, () => console.log("server is running..!"));
