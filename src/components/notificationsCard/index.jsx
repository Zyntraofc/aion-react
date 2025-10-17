// NotificationsCard.jsx
import React, { useState, useMemo } from "react";
import { AlertTriangle, Archive, MailOpen, Inbox, Eye, Trash2, DotIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tabs from "../tabs/index.jsx";

function NotificationsCard({ notifications: initialNotifications = [], urgentDeadlineDays = 3, onMarkAsRead }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  // Atualiza notificações (marcar como lida, arquivar, deletar)
  const handleUpdateNotification = (id, updates) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updates } : n))
    );
  };

  const handleMarkAsReadLocal = id => {
    handleUpdateNotification(id, { isRead: true });
    onMarkAsRead && onMarkAsRead(id);
  };

  const handleArchive = id => {
    handleUpdateNotification(id, { isArchived: true, isRead: true });
    setExpandedId(null);
  };
  const handleUnarchive = id => handleUpdateNotification(id, { isArchived: false });
  const handleDelete = id => { setNotifications(prev => prev.filter(n => n.id !== id)); setExpandedId(null); };
  const handleToggleExpand = id => setExpandedId(expandedId === id ? null : id);

  const isNotificationUrgent = (notification) => {
    if (!notification.rawDate) return false;
    const notifDate = new Date(notification.rawDate);
    const now = new Date();
    const diffDays = Math.ceil((notifDate - now) / (1000 * 60 * 60 * 24));
    return diffDays <= urgentDeadlineDays;
  };

  const counters = useMemo(() => ({
    unread: notifications.filter(n => !n.isRead && !n.isArchived).length,
    urgent: notifications.filter(n => !n.isArchived && isNotificationUrgent(n)).length,
    archived: notifications.filter(n => n.isArchived).length,
    all: notifications.filter(n => !n.isArchived).length,
  }), [notifications, urgentDeadlineDays]);

  const tabData = useMemo(() => ([
    { id: "all", label: "Todas", Icon: Inbox, count: counters.all },
    { id: "unread", label: "Não Lidas", Icon: MailOpen, count: counters.unread },
    { id: "urgent", label: "Urgentes", Icon: AlertTriangle, count: counters.urgent },
    { id: "archived", label: "Arquivadas", Icon: Archive, count: counters.archived },
  ]), [counters]);

  const filteredNotifications = useMemo(() => {
    switch(activeTab) {
      case "unread": return notifications.filter(n => !n.isRead && !n.isArchived);
      case "urgent": return notifications.filter(n => isNotificationUrgent(n) && !n.isArchived);
      case "archived": return notifications.filter(n => n.isArchived);
      case "all": default: return notifications.filter(n => !n.isArchived);
    }
  }, [notifications, activeTab, urgentDeadlineDays]);

  const NotificationItem = (notification) => {
    const { id, title, message, isRead, isArchived, rawDate, targetPath } = notification;
    const isExpanded = expandedId === id;
    const isUrgent = isNotificationUrgent(notification);
    const urgentBorderClass = isUrgent && !isRead ? 'bg-red-50 hover:bg-red-100' : 'border-l-4 border-transparent';

    return (
      <div key={id} className={`bg-gray-50 p-0 mb-2 transition-all duration-300 rounded-xl overflow-hidden
        ${isExpanded ? 'shadow-md border border-indigo-200' : 'hover:shadow-md'}
        ${isArchived ? 'opacity-60' : ''}`}
      >
        <div
          onClick={() => handleToggleExpand(id)}
          className={`p-3 cursor-pointer transition-colors duration-200 flex justify-between items-center
            ${isRead ? 'text-gray-500 hover:bg-gray-100' : 'font-semibold bg-indigo-50 hover:bg-indigo-100 text-gray-800'}
            ${urgentBorderClass}`}
        >
          <div className="flex flex-col flex-1 mr-4">
            <p className="text-sm">
              {!isRead && !isArchived && <DotIcon className={`inline-block w-5 h-5 mr-1 align-text-bottom ${isUrgent ? 'text-red-500' : 'text-indigo-600'}`} />}
              {title}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {rawDate && <span className="text-xs text-gray-400 hidden sm:block">{new Date(rawDate).toLocaleString()}</span>}
            {isExpanded ? <ChevronUp className="w-5 h-5 text-indigo-600 ml-2" /> : <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />}
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 pt-2 bg-white border-t border-gray-100 flex flex-col gap-2">
            <p className="text-gray-600 whitespace-pre-wrap">{message}</p>
            <div className="flex justify-end space-x-2">
              {targetPath && (
                <button onClick={e => { e.stopPropagation(); navigate(targetPath); }} className="flex items-center px-3 py-1.5 text-xs text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <Eye className="w-4 h-4 mr-1" /> Ir para página
                </button>
              )}
              {isArchived ? (
                <button onClick={e => { e.stopPropagation(); handleUnarchive(id); }} className="flex items-center px-3 py-1.5 text-xs text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Archive className="w-4 h-4 mr-1"/> Desarquivar
                </button>
              ) : (
                <button onClick={e => { e.stopPropagation(); handleArchive(id); }} className="flex items-center px-3 py-1.5 text-xs text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Archive className="w-4 h-4 mr-1"/> Arquivar
                </button>
              )}
              {!isRead && !isArchived && (
                <button onClick={e => { e.stopPropagation(); handleMarkAsReadLocal(id); }} className="flex items-center px-3 py-1.5 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                  <MailOpen className="w-4 h-4 mr-1" /> Marcar como lida
                </button>
              )}
              <button onClick={e => { e.stopPropagation(); handleDelete(id); }} className="flex items-center px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                <Trash2 className="w-4 h-4 mr-1"/> Excluir
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 ml-2">Notificações</h2>
      </div>

      <Tabs tabs={tabData} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className='bg-white shadow-xl rounded-xl p-6 max-h-[500px] overflow-y-auto'>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(n => <NotificationItem key={n.id} {...n} />)
        ) : (
          <p className="text-gray-500 text-center py-4">
            {activeTab === 'all' && 'Nenhuma notificação por enquanto.'}
            {activeTab === 'unread' && 'Você está em dia! Nenhuma notificação não lida.'}
            {activeTab === 'urgent' && 'Nenhuma notificação urgente pendente.'}
            {activeTab === 'archived' && 'Nenhum item arquivado encontrado.'}
          </p>
        )}
      </div>
    </div>
  );
}

export default NotificationsCard;
