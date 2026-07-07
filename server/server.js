import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Ephemeral RAM Storage for Messages
// Message structure: { id, text, username, createdAt }
let messages = [];
const MAX_MESSAGES = 100;
const MESSAGE_LIFETIME = 120000; // 2 minutes in ms

// Rate limiting map: socket.id -> timestamp of last message
const lastMessageTimes = new Map();

// Periodic Expiry Check (every 1 second)
setInterval(() => {
  const now = Date.now();
  const expiredIds = [];
  
  messages = messages.filter(msg => {
    const isExpired = (now - msg.createdAt) >= MESSAGE_LIFETIME;
    if (isExpired) {
      expiredIds.push(msg.id);
    }
    return !isExpired;
  });

  if (expiredIds.length > 0) {
    io.emit('messages_expired', expiredIds);
  }
}, 1000);

io.on('connection', (socket) => {
  // Broadcast updated count to all clients
  io.emit('online_count', io.engine.clientsCount);

  // Send initial pool of active messages
  socket.emit('initial_pool', messages);

  // Handle new thought
  socket.on('submit_thought', (data) => {
    // 1. Basic format validation
    if (!data || typeof data.text !== 'string' || typeof data.username !== 'string') {
      socket.emit('error_message', 'Invalid data format.');
      return;
    }

    const text = data.text.trim();
    const username = data.username.trim();

    // 2. Content validation
    if (text.length === 0) {
      socket.emit('error_message', 'Thought cannot be empty.');
      return;
    }
    if (text.length > 200) {
      socket.emit('error_message', 'Thought cannot exceed 200 characters.');
      return;
    }
    const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\b|\/))/i;
    if (linkRegex.test(text)) {
      socket.emit('error_message', 'Links are not allowed.');
      return;
    }
    if (username.length === 0 || username.length > 30) {
      socket.emit('error_message', 'Invalid username.');
      return;
    }

    // 3. Rate limiting check (1 message per 3 seconds)
    const now = Date.now();
    const lastTime = lastMessageTimes.get(socket.id) || 0;
    if (now - lastTime < 3000) {
      const waitSeconds = Math.ceil((3000 - (now - lastTime)) / 1000);
      socket.emit('error_message', `You are throwing thoughts too fast. Please wait ${waitSeconds}s.`);
      return;
    }

    // Update rate limit timestamp
    lastMessageTimes.set(socket.id, now);

    // Create new ephemeral message object
    const newMessage = {
      id: crypto.randomUUID(),
      text,
      username,
      createdAt: now
    };

    // Add to RAM pool
    messages.push(newMessage);

    // Enforce max count limit (100)
    if (messages.length > MAX_MESSAGES) {
      const removed = messages.shift();
      // Instantly notify everyone that this message is removed (capacity limit)
      io.emit('messages_expired', [removed.id]);
    }

    // Broadcast new message to all clients
    io.emit('new_thought', newMessage);
  });

  socket.on('disconnect', () => {
    lastMessageTimes.delete(socket.id);
    io.emit('online_count', io.engine.clientsCount);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[NeramPokku Server] running on port ${PORT}`);
  console.log(`[NeramPokku Server] CORS origin allowed: ${CORS_ORIGIN}`);
});
