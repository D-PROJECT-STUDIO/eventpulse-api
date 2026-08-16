import 'dotenv/config';
import http from 'node:http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';

const port = Number(process.env.PORT || 3000);
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.set('io', io);

io.on('connection', socket => {
  console.log('Socket connected:', socket.id);
  socket.on('join-event', eventId => socket.join(String(eventId)));
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

const start = async () => {
  await connectDB();
  server.listen(port, () => console.log(`EventPulse listening on ${port}`));
};

start().catch(error => {
  console.error(error.message);
  process.exit(1);
});
