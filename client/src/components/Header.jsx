import React from 'react';

export default function Header({ connected, connecting, onlineCount, username }) {
  const statusClass = connected ? 'active' : connecting ? 'pending' : 'inactive';
  const statusText  = connected ? 'Connected' : connecting ? 'Connecting…' : 'Disconnected';

  // Build initials from the username (e.g. "quiet_fox" → "QF")
  const initials = username
    .split('_')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);

  return (
    <header className="app-header">
      {/* Avatar */}
      <div className="header-avatar" title={`@${username}`}>
        {initials}
      </div>

      {/* Title + status */}
      <div className="header-info">
        <span className="header-title">NeramPokku</span>
        <div className="header-sub">
          <span className={`online-dot ${statusClass}`} />
          <span>{statusText} · {onlineCount} online</span>
        </div>
      </div>

      {/* Online pill */}
      <div className="header-actions">
        <div className="header-pill">
          <span className="header-pill-dot" />
          <span>{onlineCount}</span>
        </div>
      </div>
    </header>
  );
}
