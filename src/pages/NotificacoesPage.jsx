import React, { useState } from 'react';
import Title from '../components/title';
import QuickInformation from '../components/quickInformations';
import NotificationsCard from '../components/notificationsCard';

function NotificacoesPage() {
    const LOCAL_STORAGE_KEY_NOTIFICATIONS = 'configuracoesNotificacoes';

    const [daysBeforeDeadline, setDaysBeforeDeadline] = useState(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFICATIONS);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData.daysBeforeDeadline !== undefined) {
                    return parsedData.daysBeforeDeadline;
                }
            } catch (error) {
                console.error("Erro ao ler deadline do localStorage:", error);
            }
        }
        return 3; // valor padrão se não houver no localStorage
    });

    function formatTimestamp(createdAt) {
      const date = new Date(createdAt);
      const now = new Date();

      const diffTime = now - date; // diferença em ms
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      if (diffDays === 0) return `Hoje, ${hours}:${minutes}`;
      if (diffDays === 1) return `Ontem, ${hours}:${minutes}`;
      return date.toLocaleDateString() + `, ${hours}:${minutes}`;
    }


    const notifications = [
        {
            id: 1,
            title: "Novo colaborador cadastrado",
            message: "Um novo colaborador foi adicionado ao sistema.",
            isRead: false,
            isArchived: false,
            createdAt: "2025-10-10T09:30:00",
            timestamp: formatTimestamp("2025-10-10T09:30:00"),
            targetPath: "/colaboradores"
        },
        {
            id: 2,
            title: "Backup concluído",
            message: "O backup automático foi finalizado com sucesso.",
            isRead: false,
            isArchived: false,
            createdAt: "2025-10-10T22:00:00",
            timestamp: formatTimestamp("2025-10-10T22:00:00"),
            targetPath: "/configuracoes"
        }
    ];

    return (
        <div className="flex-1 flex flex-col">
            <Title title="Notificações" descrisão="Configurações de Notificações" />
            <div className="p-4">
                <QuickInformation info1={7} info2={3} info3={5} info4={3} />
                <div className="m-3">
                    <NotificationsCard
                        notifications={notifications}
                        urgentDeadlineDays={daysBeforeDeadline}
                    />
                </div>
            </div>
        </div>
    );
}

export default NotificacoesPage;
