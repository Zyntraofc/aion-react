// src/DashboardPage.jsx
import React from 'react';
import Header from "../components/header/index.jsx";
import Title from "../components/title/index.jsx";
import QuickInformations from "../components/quickInformations/index.jsx";
import QuickActions from "../components/quickActions/index.jsx";
import Recent from "../components/recent/index.jsx";

export default function HomePage() {
    return (
        <div className="flex-1 flex flex-col">
            <Title title="Visão Geral" descrisão={"Visão geral das atividades de RH"}/>
            <QuickInformations cards={[
                {title: "Justificativas Pendentes", value: 47, color:"yellow"},
                {title: "Justificativas Aprovadas",  value: 47, color: "green"},
                {title: "Colaboradores Ativos",  value: 47 },
                {title: "Taxa de Aprovação", value: 47 }
            ]}
            />
            <div className="flex flex-1 p-4 space-x-4">
                <div className="p-4 w-3/5">
                    <QuickActions />
                </div>
                <div className="p-4 w-2/5">
                    <Recent />
                </div>
            </div>
        </div>
    );
}