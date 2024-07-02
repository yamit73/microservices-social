import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(cors);

const posts = {
  post_id: {
    title: "",
    comments: [
      {
        comment_id: "",
        comment: "",
      },
    ],
  },
};

app.post("/query", (req, res) => {});

app.post("/events", (req, res) => {});
app.listen(5003, () => {
  console.log("Query servicce is listening on: 5003");
});
