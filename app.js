import "dotenv/config";
import express from "express";

import { VerifyDiscordRequest } from "./utils.js";

const app = express();
const PORT = process.env.PORT || 22222;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

app.post("/", function (req, res) {
  const { type } = req.body;
  if (type === 1) {
    res.send({
      type: 1,
    });
  }
});
