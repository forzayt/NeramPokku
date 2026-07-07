import React, { useEffect, useState } from "react";

const STEPS = [
  "Fetching latest thoughts\u2026",
  "Syncing with the void\u2026",
  "Calibrating anonymity layer\u2026",
  "Almost there\u2026",
];

export default function UpdateLoader() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return 92;
        return p + Math.random() * 3;
      });
    }, 400);

    const stepInterval = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 2200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="update-loader-overlay">
      <div className="update-loader-card">
        <div className="update-logo-ring">
          <div className="update-logo-inner">
            <span className="update-logo-emoji">??</span>
          </div>
          <svg className="update-ring-svg" viewBox="0 0 80 80">
            <circle className="update-ring-track" cx="40" cy="40" r="36" />
            <circle className="update-ring-fill" cx="40" cy="40" r="36" />
          </svg>
        </div>

        <h1 className="update-title">Updating NeramPokku</h1>
        <p className="update-step">{STEPS[stepIndex]}</p>

        <div className="update-progress-track">
          <div
            className="update-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="update-progress-pct">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
