import express, { Express, Request, Response } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "../routes/index";
import { Server, Socket } from "socket.io";

dotenv.config();

const app: Express = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use('/api', router);

io.on('connection', (socket: Socket) => {
  console.log(`[server]: Socket ${socket.id} connected`);

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log(`[server]: Socket ${socket.id} disconnected`);
  })
})

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});