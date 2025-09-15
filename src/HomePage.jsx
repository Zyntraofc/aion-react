// src/DashboardPage.jsx
import React from 'react';
import Header from "./components/header";
import Title from "./components/title";
import QuickInformations from "./components/quickInformations";
import QuickActions from "./components/quickActions";
import Recent from "./components/recent";

export default function HomePage() {
    return (
        <div className="flex-1 flex flex-col">
            <Header />
            <Title title="Visão Geral" />
            <QuickInformations pendentes={7} aprovadas={3} colaboradoresAtivos={5} taxaAprovacao={80} analise={2}/>
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