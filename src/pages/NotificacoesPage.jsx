// NotificacoesPage.jsx
import React, { useState, useEffect } from "react";
import Title from "../components/title";
import NotificationsCard from "../components/notificationsCard";
import QuickInformations from "../components/quickInformations";
import axios from "axios";
import { Spinner, Alert } from "react-bootstrap";

function NotificacoesPage() {
  const LOCAL_STORAGE_KEY_NOTIFICATIONS = "configuracoesNotificacoes";
  const API_URL = "https://ms-aion-mongodb.onrender.com/api/v1/notificacao/listar";
  const LOGGED_EMPLOYEE_ID = 12345;

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const config = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFICATIONS)) || {};
  const daysBeforeDeadline = config.daysBeforeDeadline || 10;

  const cards = [
    { id: 1, title: "Novas Justificativas", icon: "BellIcon", color: "blue" },
    { id: 2, title: "Novas Notificacoes", icon: "BellIcon", color: "yellow" },
    { id: 3, title: "Novos Atrasos", icon: "BellIcon", color: "red" },
  ];

  const isUrgent = (notification, urgentDeadlineDays) => {
    if (!notification.rawDate) return false;
    const notifDate = new Date(notification.rawDate);
    const now = new Date();
    const diffDays = Math.ceil((notifDate - now) / (1000 * 60 * 60 * 24));
    return diffDays <= urgentDeadlineDays; // verdadeiro se faltar X dias ou menos
  };


  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "Sem data";
    const date = new Date(dateStr);
    if (isNaN(date)) return "Data inválida";
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    if (diffDays === 0) return `Hoje, ${hours}:${minutes}`;
    if (diffDays === 1) return `Ontem, ${hours}:${minutes}`;
    return `${date.toLocaleDateString("pt-BR")}, ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data;

        const userNotifications = (data || []).filter(
          (notif) =>
            notif.lcdfuncionario === LOGGED_EMPLOYEE_ID ||
            notif.cdFuncionario === LOGGED_EMPLOYEE_ID
        );

        const formatted = userNotifications.map((notif) => ({
          id: notif.cdNotificacao || notif.ccdnotificacao || notif._id || Math.random().toString(36).substring(2, 9),
          title: notif.titulo || "Sem título",
          message: notif.descricao || notif.cdescricao || "Sem descrição",
          timestamp: formatTimestamp(notif.data),
          rawDate: notif.data,
          isRead: false,
          isUrgent: isUrgent(notif, daysBeforeDeadline),
        }));

        setNotifications(formatted);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err.response?.data || err);
        setError("Não foi possível carregar as notificações do servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = (idToUpdate) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === idToUpdate ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="flex-1 flex flex-col p-4">


      <div className="p-3">
        {isLoading && (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Carregando notificações...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mt-4 text-center">
            {error}
          </Alert>
        )}

        {!isLoading && !error && (
          <div className="m-3">
            <NotificationsCard
              notifications={notifications}
              urgentDeadlineDays={daysBeforeDeadline}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificacoesPage;
