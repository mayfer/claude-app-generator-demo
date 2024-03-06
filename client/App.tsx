
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { LoginRequest, LoginResponse, User, Stroke, DrawRequest } from '../shared/types';
import Canvas from './Canvas';

const socket: Socket = io();

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to server');
    });

    socket.on('stroke', (stroke: Stroke) => {
      setStrokes((prevStrokes) => [...prevStrokes, stroke]);
    });

    socket.emit('getStrokes', (strokes: Stroke[]) => {
      setStrokes(strokes);
    });

    return () => {
      socket.off('connect');
      socket.off('stroke');
    };
  }, []);

  const handleLogin = (request: LoginRequest) => {
    socket.emit('login', request, (response: LoginResponse) => {
      setUser(response.user);
    });
  };

  const handleDraw = (points: DrawRequest['points']) => {
    if (!user) {
      return;
    }
    const request: DrawRequest = {
      userId: user.id,
      points,
    };
    socket.emit('draw', request);
    setStrokes((prevStrokes) => [
      ...prevStrokes,
      {
        id: Math.random().toString(),
        userId: user.id,
        points,
        color: user.color,
      },
    ]);
  };

  return (
    <div>
      {user ? (
        <Canvas strokes={strokes} onDraw={handleDraw} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

interface LoginFormProps {
  onLogin: (request: LoginRequest) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name, color });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="color">Color:</label>
        <input
          type="color"
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
      </div>
      <button type="submit">Join</button>
    </form>
  );
}

export default App;
