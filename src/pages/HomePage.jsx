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
            <Title title="Visão Geral" />
            <QuickInformations info1={7} info2={3} info3={5} info4={3} colaboradoresAtivos={5} taxaAprovacao={80} analise={2} titulo1={"Justificativas Pendentes"} titulo2={"Justificativas Aprovadas"} titulo3={"Colaboradores Ativos"} titulo4={"Taxa de aprovação"}/>
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