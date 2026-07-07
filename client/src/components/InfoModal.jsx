import React from 'react';

export default function InfoModal({ type, onClose }) {
  if (!type) return null;

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: (
            <>
              <h3>Zero Data Collection</h3>
              <p>NeramPokku is designed with a strict zero-data-collection philosophy. There are no registration forms, database files, tracking scripts, or analytics tools.</p>
              
              <h3>Temporary Identity</h3>
              <p>Your random username is generated on your browser and resides in your browser's session storage. Once you close the tab, the username is permanently lost.</p>
              
              <h3>No Log Retention</h3>
              <p>Submitted thoughts exist only in the server's volatile RAM memory and are swept from existence after exactly 2 minutes. We do not store or log IP addresses or metadata.</p>
            </>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          content: (
            <>
              <h3>Acceptance of Terms</h3>
              <p>By entering this global public pool, you agree to these Terms. If you do not agree, please exit the site.</p>
              
              <h3>Concept & Rules</h3>
              <p>This is a real-time, public, and anonymous message stream. Keep in mind that thoughts are visible to anyone online. Do not throw private, illegal, or malicious thoughts into the void.</p>
              
              <h3>Rate Limits</h3>
              <p>To keep the service available and functional for everyone, automated spam prevention restricts submissions to one thought every 3 seconds.</p>
            </>
          )
        };
      case 'contributing':
        return {
          title: 'Contributing',
          content: (
            <>
              <h3>Open Source</h3>
              <p>NeramPokku is open source and built using React, Vite, Node.js, and Socket.IO. We welcome community additions!</p>
              
              <h3>How to Contribute</h3>
              <p>Fork the repository, test your modifications locally, and open a Pull Request. All contributions must respect our core philosophy: no databases, no user persistence, and clean minimalist layouts.</p>
              
              <h3>Tech Stack</h3>
              <p>Feel free to examine <code>LICENSE</code> and <code>CONTRIBUTING.md</code> at the root level of our repository for deeper development guidelines.</p>
            </>
          )
        };
      default:
        return null;
    }
  };

  const data = getContent();
  if (!data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{data.title}</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {data.content}
        </div>
      </div>
    </div>
  );
}
