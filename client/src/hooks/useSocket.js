import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

export function useSocket(username) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);
  const [thoughts, setThoughts] = useState([]);
  const [error, setError] = useState(null);
  
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(WS_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setConnecting(false);
      setError(null);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      setConnecting(false);
    });

    socket.on('connect_error', () => {
      setConnected(false);
      setConnecting(false);
      setError('Connection failed. Reconnecting...');
    });



    socket.on('new_thought', (thought) => {
      setThoughts((prev) => {
        // Prevent duplicate entries
        if (prev.some(t => t.id === thought.id)) return prev;
        return [thought, ...prev];
      });
    });

    socket.on('messages_expired', (expiredIds) => {
      setThoughts((prev) => prev.filter(t => !expiredIds.includes(t.id)));
    });

    socket.on('online_count', (count) => {
      setOnlineCount(count);
    });

    socket.on('error_message', (msg) => {
      setError(msg);
      // Automatically clear local errors after 4 seconds
      setTimeout(() => {
        setError(prev => prev === msg ? null : prev);
      }, 4000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const submitThought = useCallback((text) => {
    if (!socketRef.current || !socketRef.current.connected) {
      setError('Not connected to the void.');
      return;
    }
    socketRef.current.emit('submit_thought', { text, username });
  }, [username]);

  return {
    connected,
    connecting,
    onlineCount,
    thoughts,
    error,
    submitThought,
    clearError: () => setError(null)
  };
}
