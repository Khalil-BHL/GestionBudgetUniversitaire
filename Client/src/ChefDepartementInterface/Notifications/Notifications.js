import React from 'react';
import './notifications.css';

const notifications = [
  {
    status: { label: 'Demande approuvée', color: 'green' },
    senderRole: 'chef_departement',
    message: 'La demande pour l\'article "Imprimante laser HP" a été approuvée.',
    demandeId: 2345,
    time: '2025-11-24T09:30:00'
  },
  {
    status: { label: 'En cours d\'examen', color: 'orange' },
    senderRole: 'chef_departement',
    message: 'Le chef de département a reçu votre demande. Elle est en cours d\'examen.',
    demandeId: 2345,
    time: '2018-11-24T09:30:00'
  },
  {
    status: { label: 'En livraison', color: 'purple' },
    senderRole: 'comptable',
    message: 'L\'article "Imprimante laser HP" est en cours de livraison.',
    demandeId: 2345,
    time: '2018-11-24T09:30:00'
  },
  {
    status: { label: 'Reçu', color: 'blue' },
    senderRole: 'comptable',
    message: 'L\'article "Imprimante laser HP" a été reçu.',
    demandeId: 2345,
    time: '2018-11-24T09:30:00'
  }
];

function getRoleLabel(role) {
  const roles = {
    chef_departement: 'Chef de département',
    comptable: 'Comptable'
  };
  return roles[role] || role;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short'
  });
}

function Notifications() {
  return (
    <div className="notifications-bg">
      <div className="notifications-container">
        <h2 className="notifications-title">NOTIFICATIONS</h2>
        <div className="notifications-card">
          {notifications.map((n, idx) => (
            <div key={idx}>
              <div className="notification-item">
                <button className="close-btn" aria-label="Fermer">&times;</button>
                <div className="notification-content">
                  <div className="notification-main">
                    <span className={`label ${n.status.color}`}>
                      {n.status.label}
                    </span>
                    <div className="notification-sender">
                      {getRoleLabel(n.senderRole)}
                    </div>
                    <div className="notification-message">{n.message}</div>
                    <div className="notification-demandeid">
                      ID Demande : {n.demandeId}
                    </div>
                  </div>
                  <div className="notification-time">
                    <span className="clock-icon">&#128337;</span>
                    {formatDate(n.time)}
                  </div>
                </div>
              </div>
              {idx < notifications.length - 1 && (
                <div className="notification-separator" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications; 