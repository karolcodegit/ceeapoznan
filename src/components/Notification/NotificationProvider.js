import React, { useState } from 'react';
import NotificationContext from './NotificationContext';
import AnimationNotification from './AnimationNotification';

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type) => {
    setNotifications([]); // Usuń wszystkie poprzednie powiadomienia
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { message, type }
    ]);
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <AnimationNotification notifications={notifications} />
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;