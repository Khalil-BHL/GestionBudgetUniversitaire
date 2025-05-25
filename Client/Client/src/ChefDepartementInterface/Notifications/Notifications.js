import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './notifications.css';
import { NotificationContext } from './NotificationContext';

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short'
  });
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { unreadCount, setUnreadCount, checkUnreadNotifications } = useContext(NotificationContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`http://localhost:5000/api/notifications/user/${user.id}`);
      if (response.data.status === 'success') {
        const fetchedNotifications = response.data.notifications;
        setNotifications(fetchedNotifications);
        
        // We're no longer automatically marking notifications as read
        // or updating the unread count here
      } else {
        throw new Error(response.data.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);
      // Update the local state to reflect the read status
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true }
          : notification
      ));
      // Update unread count
      checkUnreadNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      if (unreadNotifications.length === 0) return;

      setRefreshing(true);
      
      await Promise.all(
        unreadNotifications.map(notification =>
          axios.put(`http://localhost:5000/api/notifications/${notification.id}/read`)
        )
      );
      
      // Update local state to reflect read status
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      
      // Update unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    await checkUnreadNotifications();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="notifications-bg">
        <div className="notifications-container">
          <h2 className="notifications-title">NOTIFICATIONS</h2>
          <div className="notifications-card">
            <div>Chargement des notifications...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-bg">
        <div className="notifications-container">
          <h2 className="notifications-title">NOTIFICATIONS</h2>
          <div className="notifications-card">
            <div className="error-message">Erreur: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-bg">
      <div className="notifications-container">
        <h2 className="notifications-title">NOTIFICATIONS</h2>
        <div className="notifications-card">
          <div className="notifications-header">
            <button 
              className="refresh-button" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </button>
            {notifications.some(n => !n.is_read) && (
              <button 
                className="mark-all-read-button" 
                onClick={handleMarkAllAsRead}
                disabled={refreshing}
              >
                Marquer tout comme lu
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="no-notifications">Aucune notification</div>
          ) : (
            notifications.map((n, idx) => (
              <div key={n.id}>
                <div className={`notification-item ${!n.is_read ? 'unread' : ''}`}>
                  <button 
                    className="close-btn" 
                    aria-label="Fermer"
                    onClick={() => handleMarkAsRead(n.id)}
                  >
                    &times;
                  </button>
                  <div className="notification-content">
                    <div className="notification-main">
                      <span className={`label ${n.is_read ? 'blue' : 'orange'}`}>
                        {n.is_read ? 'Lu' : 'Non lu'}
                      </span>
                      <div className="notification-title">{n.title}</div>
                      <div className="notification-message">{n.message}</div>
                      {n.request_id && (
                        <div className="notification-demandeid">
                          ID Demande : {n.request_id}
                        </div>
                      )}
                    </div>
                    <div className="notification-time">
                      <span className="clock-icon">&#128337;</span>
                      {formatDate(n.created_at)}
                    </div>
                  </div>
                </div>
                {idx < notifications.length - 1 && (
                  <div className="notification-separator" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;