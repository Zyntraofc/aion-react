import React, { useState, useEffect } from "react";
import Title from "../components/title";
import NotificationsCard from "../components/notificationsCard";
import QuickInformations from "../components/quickInformations";
import EventsTabContent from "../components/eventsTabContents";
import Tabs from "../components/tabs"; // ✅ importando o seu Tabs

function NotificacoesPage() {
    // Estados principais
    const [activeTab, setActiveTab] = useState("Notificações");
    const [notifications, setNotifications] = useState([]);


    // Dados das abas
    const tabsData = [
        { id: "Notificações", label: "Notificações" },
        { id: "Eventos", label: "Eventos" },
    ];

    // Troca de aba
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    // Exemplo de busca de notificações
    useEffect(() => {
    }, [activeTab]);

    const handleMarkAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, lida: true } : n
            )
        );
    };

    const renderContent = () => {

        switch (activeTab) {
            case "Notificações":
                return (
                    <NotificationsCard
                        notifications={notifications}
                        onMarkAsRead={handleMarkAsRead}
                    />
                );
            case "Eventos":
                return <EventsTabContent />;
            default:
                return (
                    <div className="p-4 text-gray-500">
                        Nenhum conteúdo configurado para esta aba.
                    </div>
                );
        }
    };

    return (
        <div className="">
            <Title title="Notificações e Eventos" descrisao="Gerencie suas notificações e eventos" />
            <div className="my-4" />
            <Tabs
                tabs={tabsData}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            <div className="mt-4">{renderContent()}</div>
        </div>
    );
}

export default NotificacoesPage;