import React, { useEffect, useRef } from 'react';
import ThoughtCard from './ThoughtCard';

export default function ThoughtStream({ thoughts, ownUsername }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new thoughts arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughts.length]);

  if (thoughts.length === 0) {
    return (
      <div className="thought-stream-empty">
        <div className="empty-icon">🌌</div>
        <p className="empty-title">The void is quiet.</p>
        <p className="empty-subtitle">Be the first to cast a thought into the stream.</p>
      </div>
    );
  }

  // Reverse to show oldest → newest top → bottom
  const chronological = [...thoughts].reverse();

  return (
    <div className="thought-stream">
      <div className="date-divider">
        <span className="date-divider-text">Here no one will be alone nor bored</span>
      </div>
      {chronological.map((thought) => (
        <ThoughtCard key={thought.id} thought={thought} ownUsername={ownUsername} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
