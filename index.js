import { format } from "date-fns";
import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const events_json = fs.readFileSync("node.json", "utf-8");
let events = JSON.parse(events_json);

app.get("/*", (req, res) => {
  res.json({ events });
});

app.post("/*", (req, res) => {
  const { EventType, TaskAttributes } = req.body;

  if (!EventType || !TaskAttributes) {
    res.status(400).json({
      error: "Los datos no han sido enviados correctamente",
    });
    return;
  }

  const fecha = format(new Date(), "yyyy/MM/dd");
  const hora = format(new Date(), "hh:mm:ss:bbb");
  const { data, conversationSid } = TaskAttributes;
  const event = { EventType, fecha, hora, data, conversationSid };

  events.push(event);

  fs.writeFileSync("node.json", JSON.stringify(events));

  res.json({ data: event });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server is running in port : " + PORT);
});
