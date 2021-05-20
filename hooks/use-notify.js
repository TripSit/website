import { useContext } from 'react';
import { NotificationContext } from '../components/notifications/provider';

export default function useNotify() {
  return useContext(NotificationContext).showNotification;
}
