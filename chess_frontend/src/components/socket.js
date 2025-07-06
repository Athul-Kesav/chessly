// socket.js
import { io } from "socket.io-client";
const socket = io("http://localhost:3001"); // your server address
export default socket;
