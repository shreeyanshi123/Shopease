import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';

export default function Notifications({ notifications, unreadCount, onOpen }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef();

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
        if (onOpen) onOpen();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onOpen]);

  return (
    <div className="relative">
      <Button variant="outline" size="icon" onClick={() => { setOpen(!open); if (!open && onOpen) onOpen(); }}>
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>
      {open && (
        <div ref={panelRef} className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto border">
          <div className="p-4 border-b font-bold text-gray-700">Notifications</div>
          <ul className="divide-y">
            {notifications.length === 0 ? (
              <li className="p-4 text-gray-500 text-sm">No notifications</li>
            ) : notifications.map((n, i) => (
              <li key={i} className="p-4 text-sm">
                <div className="font-semibold">{n.title}</div>
                <div className="text-gray-600">{n.description}</div>
                <div className="text-xs text-gray-400 mt-1">{n.time}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
