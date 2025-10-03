import React from 'react';
import Title from '../components/title';
import Tabs from '../components/tabs';
import QuickInformation from '../components/quickInformations';

function NotificacoesPage() {
const tabs = ["Todas", "Não Lidas", "Arquivadas"];
const [activeTab, setActiveTab] = React.useState(tabs[0]);
const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

const renderContent = () => {
        switch (activeTab) {
            case "Todas":
                return <div>Todas as notificações</div>;
            case "Não Lidas":
                return <div>Notificações não lidas</div>;
            case "Arquivadas":
                return <div>Notificações arquivadas</div>;
            default:
                return null;
        }
}

    return (
        <div className="flex-1 flex flex-col">
            <Title title="Notificações" descrisão={"Configurações de Notificações"} />
            <div className="p-4">
            <QuickInformation info1={7} info2={3} info3={5} info4={3}/>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange}/>
            {renderContent()}
            </div>
</div>


    )
}
export default NotificacoesPage;