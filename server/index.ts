
import { app, io } from './run_express';
import { initDb, createUser, getUser, createStroke, getStrokes } from './db';
import { LoginRequest, LoginResponse, DrawRequest, User, Stroke } from '../shared/types';
import { v4 as uuidv4 } from 'uuid';

initDb();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('login', async (req: LoginRequest, callback) => {
    const userId = uuidv4();
    const user: User = {
      id: userId,
      name: req.name,
      color: req.color,
    };
    await createUser(user);
    callback({ user });
  });

  socket.on('draw', async (req: DrawRequest) => {
    const user = await getUser(req.userId);
    if (!user) {
      return;
    }
    const stroke: Stroke = {
      id: uuidv4(),
      userId: req.userId,
      points: req.points,
      color: user.color,
    };
    await createStroke(stroke);
    socket.broadcast.emit('stroke', stroke);
  });

  socket.on('getStrokes', async (callback) => {
    const strokes = await getStrokes();
    callback(strokes);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
