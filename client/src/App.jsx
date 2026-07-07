import React, { useState } from 'react';
import { getAnonymousUsername } from './utils/username';
import { useSocket } from './hooks/useSocket';
import Header from './components/Header';
import ThoughtStream from './components/ThoughtStream';
import Composer from './components/Composer';
import InfoModal from './components/InfoModal';
import UpdateLoader from './components/UpdateLoader';

export default function App() {
  const [username]   = useState(() => getAnonymousUsername());
  const [modalType, setModalType] = useState(null);

  const {
    connected, connecting, onlineCount,
    thoughts, error, submitThought,
  } = useSocket(username);

  // Show a fake "website updating" screen when server is unreachable
  const serverUnreachable = !connected && !connecting;

  return (
    <div className="app-container">
      {/* ── Full-screen update loader when server is down ── */}
      {serverUnreachable && <UpdateLoader />}

      {/* ── Top bar ── */}
      <Header
        connected={connected}
        connecting={connecting}
        onlineCount={onlineCount}
        username={username}
      />

      {/* ── Error toast (below header) ── */}
      {error && !serverUnreachable && (
        <div className="app-toast-error">
          <span className="toast-icon">!</span>
          <span className="toast-text">{error}</span>
        </div>
      )}

      {/* ── Message stream ── */}
      <main className="main-content">
        <ThoughtStream thoughts={thoughts} ownUsername={username} />
      </main>

      {/* ── Composer + footer links ── */}
      <footer className="app-footer-composer">
        <Composer onSubmit={submitThought} connected={connected} />
        <div className="footer-links">
          <button onClick={() => setModalType('privacy')}     className="footer-link-btn">Privacy</button>
          <span className="footer-dot">•</span>
          <button onClick={() => setModalType('terms')}       className="footer-link-btn">Terms</button>
          <span className="footer-dot">•</span>
          <button onClick={() => setModalType('contributing')} className="footer-link-btn">Contributing</button>
        </div>
      </footer>

      {/* ── Info modal ── */}
      <InfoModal type={modalType} onClose={() => setModalType(null)} />
    </div>
  );
}
