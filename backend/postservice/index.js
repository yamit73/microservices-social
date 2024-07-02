import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
const corsOpts = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));
const posts = {};

app.post("/posts", async (req, res) => {
  const postId = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[postId] = { post_id: postId, title: title, comments: [] };

  const eventResp = await axios.post("http://localhost:5005/events", {
    type: "PostCreate",
    data: {
      post_id: postId,
      title: title,
    },
  });
  console.log(eventResp);
  res.status(200).send(posts[postId]);
});
app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/events", (req, res) => {
  const eventData = req.body;
  if (eventData.type == "CommentCreate") {
    const comments = posts[eventData.data.post_id].comments || [];
    comments.push({
      comment_id: eventData.data.comment_id,
      comment: eventData.data.comment,
    });
    posts[eventData.data.post_id].comments = comments;
  }
  res.status(200).send({});
});

app.listen(5001, () => {
  console.log("Server is listening on port: 5001");
});
