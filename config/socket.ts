import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "./api";

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
};
