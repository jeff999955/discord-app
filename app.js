import "dotenv/config";
import express from "express";

const nacl = require("tweetnacl");

import { VerifyDiscordRequest } from "./utils.js";

const app = express();
const PORT = process.env.PORT || 22222;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

app.post("/", function (req, res) {
  const isVerified = verifyMessage(req);
  if (!isVerified) {
    res.status(401).send("Bad request signature");
  }
  const { type } = req.body;
  if (type === 1) {
    res.status(200).send({
      type: 1,
    });
    console.log("Ping received");
  } else {
    console.info(req.body);
  }
});

function verifyMessage(request) {
  const signature = request.get("X-Signature-Ed25519");
  const timestamp = request.get("X-Signature-Timestamp");

  return nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY, "hex")
  );
}
