import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*", // Allow requests from any origin, you might want to restrict this in production
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.post("/events", async (req, res) => {
  const rawBody = req.body;

  try {
    await axios.post("http://localhost:5001/events", rawBody);
    console.log("Request forwarded to http://localhost:5001/events");
  } catch (error) {
    console.error(
      "Error forwarding request to http://localhost:5001/events:",
      error.message
    );
  }

  try {
    await axios.post("http://localhost:5002/events", rawBody);
    console.log("Request forwarded to http://localhost:5002/events");
  } catch (error) {
    console.error(
      "Error forwarding request to http://localhost:5002/events:",
      error.message
    );
  }

  res.status(200).send("OK");
});

app.listen(5005, () => {
  console.log("Event bus is listening on port 5005");
});
