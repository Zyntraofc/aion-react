import React from 'react';
import Title from '../components/title/index.jsx';
import Tabs from '../components/tabs/index.jsx';


import { Settings, Shield, SlidersHorizontal, Bell, HardDrive, Calendar } from 'lucide-react';
import ConfiguracoesGeraisTabContent from '../components/ConfiguracoesGerais/index.jsx';
import JustificativasTabContent from '../components/justificationsTabContent/index.jsx';
import NotificationsTabContents from '../components/NotificationsTabContents/index.jsx';
import SystemTabContents from '../components/SystemTabContents/index.jsx';
import EventsTabContents from '../components/eventsTabContents/index.jsx';


function ConfiguracoesPage() {

    const tabsData = [
        { id: "geral", label: "Geral", Icon: Settings, count: 0 },
        { id: "justificativas", label: "Justificativas", Icon: SlidersHorizontal, count: 0 },
        { id: "notificacoes", label: "Notificações", Icon: Bell, count: 0},
        { id: "sistema", label: "Sistema", Icon: HardDrive, count: 0 },
        { id: "eventos", label: "Eventos", Icon: Calendar, count: 0 }
    ];

    const [activeTab, setActiveTab] = React.useState(tabsData[0].id);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    }


    const renderContent = () => {
        switch (activeTab) {
            case "geral":
                return <ConfiguracoesGeraisTabContent />
            case "justificativas":
                return <JustificativasTabContent />
            case "notificacoes":
                return <NotificationsTabContents />
            case "sistema":
                return <SystemTabContents Version={"1.0.0"} Users={"10"} LastBackup={"2023-08-01"}/>
            case "eventos":
                return <EventsTabContents />

            default:
                return <div className="p-4 text-gray-500">Nenhum conteúdo configurado para esta aba.</div>;
        }
    };

    return (
        <div className="flex-1 flex flex-col">

            <Title title="Configurações" descrição="Configurações do sistema" />

            <div className="p-4">
                <Tabs tabs={tabsData} activeTab={activeTab} onTabChange={handleTabChange}/>
                {renderContent()}
            </div>

        </div>
    );
}

export default ConfiguracoesPage;