import { useContext } from 'react';
import styled from 'styled-components';
import { Alert } from 'react-bootstrap';
import { NotificationContext } from './provider';

const List = styled.ul`
  display: block;
  list-style: none;
  position: fixed;
  top: 0.8rem;
  right: 0.8rem;
  left: 0.8rem;
  @media (min-width: 768px) {
    left: auto;
  }
  &:empty {
    display: none;
  }

  > li {
    margin-bottom: 0.4rem;
    @media (min-width: 768px) {
      width: 8rem;
    }
  }
`;

export default function NotificationsList() {
  const { notifications, hideNotification } = useContext(NotificationContext);

  return (
    <List>
      {notifications.map(({ id, variant, message }) => (
        <Alert key={id} as="li" variant={variant} onClose={() => hideNotification(id)}>
          <p>{message}</p>
        </Alert>
      ))}
    </List>
  );
}
