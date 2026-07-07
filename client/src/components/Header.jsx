import React from 'react';

export default function Header({ connected, connecting, onlineCount, username, onChangeUsername }) {
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
      <div
        className="header-avatar"
        onClick={onChangeUsername}
        title={`@${username} (Click to change)`}
        style={{ cursor: 'pointer' }}
      >
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

      {/* Username pill */}
      <div className="header-actions">
        <div 
          className="header-pill" 
          onClick={onChangeUsername}
          style={{ cursor: 'pointer' }}
          title="Click to change username"
        >
          <span className="header-pill-dot" />
          <span>@{username}</span>
        </div>
      </div>
    </header>
  );
}
