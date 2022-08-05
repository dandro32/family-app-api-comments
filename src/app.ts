import express from "express";
import cors from "cors";
import { Db } from "mongodb";
import { Server } from "socket.io";
import http from "http";

const port: string = process.env.HTTP_PORT as string;

export const appFactory = (db: Db) => {
  const app = express();
  const server = http.createServer(app);

  server.listen(port, function () {
    console.log(`Server is listening on ${port}`);
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000", "https://family-app-fe.herokuapp.com"],
    })
  );

  app.use(express.json());

  app.get("/", function (req, res, next) {
    res.send("Family-app comments api is working");
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return app;
};
