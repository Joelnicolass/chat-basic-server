import express from "express";
import cors from "cors";
//socket io
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 2000;

app.use(cors());

io.on("connection", (socket) => {
  socket.on("joinTo", (room) => {
    socket.join(room);

    socket.on("message", (msg) => {
      io.to(room).emit("newMessage", {
        id: crypto.randomUUID(),
        text: msg.text,
        user: msg.user,
        date: Date.now(),
      });
    });
  });

  socket.on("disconnect", () => {});
});

app.get("/health", (req, res) => {
  res.json({ message: "ok" });
});

httpServer.listen(port, () => {
  console.log(`Server: PORT ${port}`);
});
