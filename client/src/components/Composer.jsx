import React, { useState, useEffect, useRef } from 'react';

export default function Composer({ onSubmit, connected }) {
  const [text,     setText]     = useState('');
  const [cooldown, setCooldown] = useState(0);
  const textareaRef = useRef(null);

  // Count-down cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const hasLink = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\b|\/))/i.test(text);
  const canSend = text.trim().length > 0 && text.length <= 200 && cooldown === 0 && connected && !hasLink;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!canSend) return;
    onSubmit(text.trim());
    setText('');
    setCooldown(3);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charWarn = text.length >= 180;

  return (
    <form className="composer-form" onSubmit={handleSubmit}>
      {hasLink && (
        <div className="composer-warning">
          <span>⚠️ Sharing links is not allowed</span>
        </div>
      )}
      <div className="composer-bar">
        {/* Input area */}
        <div className="composer-input-wrap">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Reply Message"
            maxLength={200}
            disabled={!connected || cooldown > 0}
            className="composer-textarea"
            rows={1}
          />
          {text.length > 0 && (
            <span className={`char-counter ${charWarn ? 'warn' : ''}`}>
              {text.length}/200
            </span>
          )}
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="composer-send-btn"
          disabled={!canSend}
          title="Send"
        >
          {cooldown > 0
            ? <span className="send-cooldown">{cooldown}s</span>
            : <span>➤</span>
          }
        </button>
      </div>
    </form>
  );
}
