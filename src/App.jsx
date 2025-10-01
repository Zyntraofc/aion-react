import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ColaboradoresPage from "./pages/ColaboradoresPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import JustificativasPage from "./pages/JustificativasPage.jsx";
import NotificacoesPage from "./pages/NotificacoesPage.jsx";
import ConfiguracoesPage from "./pages/ConfiguracoesPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import Sidebar  from "./components/sidebar";
import { SidebarItem } from "./components/sidebarItem";
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
import Header from "./components/header/index.jsx";

function AppContent() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

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
                                active={isActive}
                                collapsed={isCollapsed}
                            />
                        </Link>
                    );
                })}
            </Sidebar>

            {/* Rotas */}
            <div className="flex-1">
                <Header onToggle={() => setIsCollapsed(!isCollapsed)} />
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    {routes.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                    ))}
                </Routes>
            </div>
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
