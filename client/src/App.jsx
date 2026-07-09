import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { getAnonymousUsername } from './utils/username';
import { useSocket } from './hooks/useSocket';
import Header from './components/Header';
import ThoughtStream from './components/ThoughtStream';
import Composer from './components/Composer';
import InfoModal from './components/InfoModal';
import UpdateLoader from './components/UpdateLoader';
import UsernameModal from './components/UsernameModal';

export default function App() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('nerampokku_username') || '';
  });
  const [showUsernameModal, setShowUsernameModal] = useState(() => {
    return !localStorage.getItem('nerampokku_username');
  });
  const [modalType, setModalType] = useState(null);

  const {
    connected, connecting, onlineCount,
    thoughts, error, submitThought,
  } = useSocket(username);

  // Show a fake "website updating" screen when server is unreachable
  const serverUnreachable = !connected && !connecting;

  const handleConfirmUsername = (newUsername) => {
    localStorage.setItem('nerampokku_username', newUsername);
    setUsername(newUsername);
    setShowUsernameModal(false);
  };

  return (
    <div className="app-container">
      <Analytics />
      {/* ── Full-screen update loader when server is down ── */}
      {serverUnreachable && <UpdateLoader />}

      {/* ── Top bar ── */}
      <Header
        connected={connected}
        connecting={connecting}
        onlineCount={onlineCount}
        username={username || 'anonymous'}
        onChangeUsername={() => setShowUsernameModal(true)}
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
          <span className="footer-dot">•</span>
          <a href="https://github.com/forzayt/NeramPokku" target="_blank" rel="noopener noreferrer" className="footer-link-btn">Source on github</a>
        </div>
      </footer>

      {/* ── Info modal ── */}
      <InfoModal type={modalType} onClose={() => setModalType(null)} />

      {/* ── Username configuration modal ── */}
      {showUsernameModal && (
        <UsernameModal
          currentUsername={username}
          onConfirm={handleConfirmUsername}
          onClose={() => setShowUsernameModal(false)}
          isForcePrompt={!localStorage.getItem('nerampokku_username')}
        />
      )}
    </div>
  );
}

