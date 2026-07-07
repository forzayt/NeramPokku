import React, { useState, useEffect } from 'react';
import { generateRandomUsername } from '../utils/username';

export default function UsernameModal({ currentUsername, onConfirm, onClose, isForcePrompt }) {
  const [val, setVal] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // If there is an existing username, default to it, otherwise generate a fresh suggestion
    if (currentUsername) {
      setVal(currentUsername);
    } else {
      setVal(generateRandomUsername());
    }
  }, [currentUsername]);

  const handleRoll = (e) => {
    e.preventDefault();
    setVal(generateRandomUsername());
    setError('');
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    const cleanVal = val.trim();
    
    if (cleanVal.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (cleanVal.length > 20) {
      setError('Username cannot exceed 20 characters.');
      return;
    }
    // Only alphanumeric, underscores, and hyphens allowed
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(cleanVal)) {
      setError('Only letters, numbers, underscores (_), and hyphens (-) allowed.');
      return;
    }

    onConfirm(cleanVal);
  };

  return (
    <div className="modal-overlay username-overlay" onClick={!isForcePrompt ? onClose : undefined}>
      <div className="modal-content username-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="username-modal-header">
          <div className="username-modal-badge">Identity</div>
          <h2>Choose Your Handle</h2>
          <p className="username-modal-subtitle">
            Enter the global void with a name of your choice, or let fate decide.
          </p>
        </div>

        <form onSubmit={validateAndSubmit} className="username-form">
          <div className="username-input-group">
            <div className="username-prefix">@</div>
            <input
              type="text"
              className={`username-input ${error ? 'input-error' : ''}`}
              placeholder="username"
              value={val}
              onChange={(e) => {
                setVal(e.target.value);
                if (error) setError('');
              }}
              maxLength={20}
              autoFocus
            />
          </div>

          {error && <div className="username-validation-error">{error}</div>}

          <div className="username-actions">
            <button
              type="button"
              className="username-btn-secondary"
              onClick={handleRoll}
              title="Generate a random nickname"
            >
              <span className="btn-icon">🎲</span> Surprise Me
            </button>

            <button type="submit" className="username-btn-primary">
              Enter Void <span className="btn-arrow">→</span>
            </button>
          </div>
        </form>

        {!isForcePrompt && (
          <button className="username-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
