import React from 'react';
import Title from '../components/title/index.jsx';
import Tabs from '../components/tabs/index.jsx';
import ConfigCard from '../components/configCard/index.jsx';
import { Settings, UserPlus, CalendarCheck } from 'lucide-react';

function ColaboradoresPage() {

    const tabs = ["Geral", "Permissões", "Justificativas", "Notificações", "Sistema", "Eventos"];
    const [activeTab, setActiveTab] = React.useState(tabs[0]);
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    }
    const renderContent = () => {
        switch (activeTab) {
            case "Geral":
                return <ConfigCard  title={"Configurações Gerais"}  icon={"Settings"} children={<p>Configurações Gerais</p>}/>;
            case "Permissões":
                return <ConfigCard />;
            case "Justificativas":
                return <ConfigCard />;
            case "Notificações":
                return <ConfigCard />;
            case "Sistema":
                return <ConfigCard />;
            case "Eventos":
                return <ConfigCard />;
            default:
                return null;
        }

    };
    return (
<div className="flex-1 flex flex-col">
    <div />
    <Title title="Configurações" descrisão={"Configurações do sistema"} />
    <div className="p-4">
    <Tabs  tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange}/>
    {renderContent()}
    </div>
    <button className="fixed bottom-6 rounded-2xl right-6 bg-indigo-500 text-white p-4  shadow-lg hover:bg-indigo-600 transition-colors">
Salvar Alterações
    </button>

</div>
    );
}

export default ColaboradoresPage;