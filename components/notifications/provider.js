import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';

export const NotificationContext = createContext({
  notifications: [],
});

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  function removeNotification(id) {
    setNotifications(prev => prev.filter(a => a.id !== id));
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,

        showNotification(message, options = {}) {
          const id = nanoid();
          const timeout = setTimeout(() => {
            removeNotification(id);
          }, 6000);

          setNotifications(prev => prev.concat({
            id,
            timeout,
            message,
            variant: options.variant || 'info',
          }));
        },

        hideNotification(id) {
          const notification = notifications.find(a => a.id === id);
          if (notification) clearTimeout(notification.timeout);
          removeNotification(id);
        },
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationProvider;
