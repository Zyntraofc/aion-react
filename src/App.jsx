import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import HomePage from "./HomePage";
import DashboardPage from "./DashboardPage";
import ColaboradoresPage from "./ColaboradoresPage";
import OnboardingPage from "./OnboardingPage";
import JustificativasPage from "./JustificativasPage";
import NotificacoesPage from "./NotificacoesPage";
import ConfiguracoesPage from "./ConfiguracoesPage";
import ReportPage from "./ReportPage.jsx";
import {
    homeIcon,
    dashboardIcon,
    colaboratorIcon,
    onboardingIcon,
    justificationIcon,
    notificationIcon,
    settingsIcon,
    reportIcon
} from "./assets/icons";

import { Sidebar } from "./components/sidebar";
import { SidebarItem } from "./components/sidebarItem";

function AppContent() {
    const location = useLocation();

    const routes = [
        { path: "/home", text: "Home", element: <HomePage />, icon: homeIcon },
        { path: "/dashboard", text: "Dashboard", element: <DashboardPage />, icon: dashboardIcon },
        { path: "/colaboradores", text: "Colaboradores", element: <ColaboradoresPage />, icon: colaboratorIcon },
        { path: "/onboarding", text: "Onboarding", element: <OnboardingPage />, icon: onboardingIcon },
        { path: "/justificativas", text: "Justificativas", element: <JustificativasPage />, icon: justificationIcon },
        { path: "/relatorios", text: "Relatórios", element: <ReportPage />, icon: reportIcon },
        { path: "/notificacoes", text: "Notificações", element: <NotificacoesPage />, icon: notificationIcon },
        { path: "/configuracoes", text: "Configurações", element: <ConfiguracoesPage />, icon: settingsIcon },
    ];

    return (
        <main className="flex min-h-screen bg-gray-100">
            {/* Sidebar dinâmica */}
            <Sidebar>
                {routes.map(({ path, text, icon }) => {
                    const isActive = location.pathname === path;
                    return (
                        <Link key={path} to={path}>
                            <SidebarItem
                                icon={<img src={icon} alt={text} width={20} height={20} />}
                                text={text}
                                active={isActive}  // passa prop pro item
                            />
                        </Link>
                    );
                })}
            </Sidebar>

            {/* Rotas */}
            <Routes>
                {routes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Routes>
        </main>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
