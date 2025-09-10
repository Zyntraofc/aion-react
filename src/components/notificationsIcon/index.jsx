import { Bell } from 'lucide-react';

function NotificationIcon({ number }) {
    const showBadge = number > 0;
    const displayNumber = number > 99 ? '!' : number;


  return (
    <div className="relative">
      <Bell size={28} className="text-blue-600" />
      {showBadge && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9.5px] font-bold text-white">
{displayNumber}
        </span>
      )}
    </div>
  );
}

export default NotificationIcon;