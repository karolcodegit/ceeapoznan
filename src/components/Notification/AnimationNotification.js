import React, { useState, useEffect } from 'react';
import Notification from './Notification';

const AnimationNotification = ({ notifications = [] }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Dodaj nowe powiadomienia do listy
    setVisibleNotifications(notifications);
  }, [notifications]);

  // Usuń powiadomienie po upływie określonego czasu
  useEffect(() => {
    const timeouts = visibleNotifications.map((notification, index) => {
      return setTimeout(() => {
        setVisibleNotifications(prevNotifications => {
          return prevNotifications.filter((_, i) => i !== index);
        });
      }, 5000);
    });

    return () => timeouts.forEach(clearTimeout); // Czyść timeouty przy odmontowaniu
  }, [visibleNotifications]);

  return (
    <>
    {visibleNotifications.map((notification, index) => (
      <Notification
        key={index}
        message={notification.message}
        type={notification.type}
        showMessage={true}
        index={index}
      />
    ))}
  </>
  );
};

export default AnimationNotification;
