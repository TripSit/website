import PropTypes from 'prop-types';
import NotificationProvider from './provider';
import NotificationsList from './list';

function Notifications({ children }) {
  return (
    <NotificationProvider>
      {children}
      <NotificationsList />
    </NotificationProvider>
  );
}

Notifications.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Notifications;
