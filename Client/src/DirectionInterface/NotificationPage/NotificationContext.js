import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Function to check for unread notifications
  const checkUnreadNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      // Instead of calling a non-existent endpoint, use the existing one
      // and count unread notifications on the client side
      const response = await axios.get(`http://localhost:5000/api/notifications/user/${user.id}`);
      if (response.data.status === 'success') {
        // Count notifications where is_read is false
        const unreadNotifications = response.data.notifications.filter(n => !n.is_read);
        setUnreadCount(unreadNotifications.length);
      }
    } catch (err) {
      console.error('Error checking unread notifications:', err);
    }
  };

  // Check for unread notifications when the component mounts
  useEffect(() => {
    checkUnreadNotifications();
    
    // Set up polling to check for new notifications every 15 seconds
    const intervalId = setInterval(checkUnreadNotifications, 15000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, checkUnreadNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};