import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          No notifications yet
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification._id}
              className={`bg-white rounded-lg shadow-md p-4 transition-all ${
                !notification.read ? 'border-l-4 border-blue-500' : ''
              }`}
              onClick={() => !notification.read && markAsRead(notification._id)}
            >
              <p className="text-gray-800">{notification.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="text-xs text-blue-600 mt-2 hover:text-blue-800"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;