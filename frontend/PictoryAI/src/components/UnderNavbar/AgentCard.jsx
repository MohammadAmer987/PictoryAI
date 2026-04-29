import React from "react";

const tasks = [
  { icon: "◌", name: "Analyzing your input",      status: "PENDING"    },
  { icon: "⟳", name: "Generating AI content",    status: "running" },
  { icon: " ✓", name: "Your result is ready",   status: "done" },
];

export default function AgentCard() {
  return (
    <div className="ha-card-wrap">

      <div className="ha-floating-tag top-right">
        <span className="ha-ft-dot green"></span>
        Agent active
      </div>

      <div className="ha-card">
        <div className="ha-card-header">
          <div className="ha-card-title-row">
            <div className="ha-card-avatar">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.8 2 6 3.8 6 6C6 7.5 6.8 8.8 8 9.5V11H12V9.5C13.2 8.8 14 7.5 14 6C14 3.8 12.2 2 10 2Z" fill="white" opacity="0.9"/>
                <path d="M7 13H13C14.7 13 16 14.3 16 16V18H4V16C4 14.3 5.3 13 7 13Z" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <span className="ha-card-name">PICTORY AI</span>
          </div>
          <div className="ha-card-status">
            <span className="ha-status-dot"></span>
            Running
          </div>
        </div>

        <div className="ha-card-body">
          {tasks.map((t) => (
            <div className="ha-task" key={t.name}>
              <div className={`ha-task-icon ${t.status}`}>{t.icon}</div>
              <div className="ha-task-info">
                <div className="ha-task-name">{t.name}</div>
                <div className="ha-task-meta">{t.meta}</div>
              </div>
              <span className={`ha-task-badge ${t.status}`}>{t.status}</span>
            </div>
          ))}
        </div>

        <div className="ha-card-footer">
          <div className="ha-prompt-bar">Ask your agent anything...</div>
          <button className="ha-send-btn">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 14L14 8L2 2V6.5L10 8L2 9.5V14Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="ha-floating-tag bottom-left">
        <span className="ha-ft-dot yellow"></span>
       AI · Fast mode
      </div>

    </div>
  );
}