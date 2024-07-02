import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  res.status(200).send(commentsByPostId[postId] ?? []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { comment } = req.body;
  const postId = req.params.id;
  let comments = commentsByPostId[postId] || [];
  comments.push({ comment_id: commentId, comment: comment });
  commentsByPostId[postId] = comments;
  try {
    const eventResp = await axios.post("http://localhost:5005/events", {
      type: "CommentCreate",
      data: {
        post_id: postId,
        comment_id: commentId,
        comment: comment,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
  res.status(200).send(comments);
});

app.post("/events", (req, res) => {
  console.log("Event received: " + req.body.type);
  res.status(200).send({});
});

app.listen(5002, () => {
  console.log("Server is listening on: 5002");
});
