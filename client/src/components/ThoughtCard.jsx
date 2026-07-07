import React, { useEffect, useState } from 'react';

// Deterministic colour bucket from username string
function colourSide(username) {
  const sum = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return sum % 2 === 0 ? 'left' : 'right';
}

function getRelativeTime(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 10)  return 'just now';
  if (secs < 60)  return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  const rem  = secs % 60;
  return `${mins}m ${rem}s ago`;
}

export default function ThoughtCard({ thought, ownUsername }) {
  const [timeLeft,   setTimeLeft]   = useState(120);
  const [relTime,    setRelTime]    = useState('just now');
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    const tick = () => {
      const elapsed   = Math.floor((Date.now() - thought.createdAt) / 1000);
      const remaining = Math.max(0, 120 - elapsed);
      setTimeLeft(remaining);
      setRelTime(getRelativeTime(thought.createdAt));
      if (remaining <= 2) setIsExpiring(true);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [thought.createdAt]);

  // Decide side: user's own message goes right, others go left
  const isOwn = thought.username === ownUsername;
  const side  = isOwn ? 'right' : 'left';

  const lifePercent = (timeLeft / 120) * 100;

  const initials = thought.username
    .split('_')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);

  return (
    <div className={`message-row row-${side} ${isExpiring ? 'expiring' : ''}`}>
      {/* Avatar */}
      <div className={`row-avatar avatar-${side}`}>
        {initials}
      </div>

      {/* Bubble column */}
      <div className="bubble-col">
        <span className={`bubble-name name-${side}`}>@{thought.username}</span>
        <div className={`thought-bubble bubble-${side}`}>
          <p className="bubble-text">{thought.text}</p>
          {/* Shrinking lifeline */}
          <div
            className="bubble-lifeline"
            style={{ width: `${lifePercent}%` }}
          />
        </div>

      </div>
    </div>
  );
}
