const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.get("/", (req, res) => res.send("wind server ok"));

let windState = { x: 0, y: 0, strength: 0 };

io.on("connection", (socket) => {
  socket.emit("wind", windState);

  socket.on("wind", (data) => {
    const x = Number(data.x) || 0;
    const y = Number(data.y) || 0;
    const strength = Math.max(0, Math.min(1, Number(data.strength) || 0));
    windState = { x, y, strength };
    io.emit("wind", windState);
  });
});

const PORT = process.env.PORT || 3200;
server.listen(PORT, "0.0.0.0", () => console.log("listening on", PORT));
