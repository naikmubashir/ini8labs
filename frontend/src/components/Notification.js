import React from 'react';
import './Notification.css';

function Notification({ message, type }) {
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div className={`notification ${type}`}>
      <span className="notification-icon">{icon}</span>
      <span className="notification-message">{message}</span>
    </div>
  );
}

export default Notification;
