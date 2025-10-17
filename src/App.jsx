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
import Header from "./components/header/index.jsx";
import icons from "./assets/icons/index.jsx";
function AppContent() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);


    const routes = [
        { path: "/home", text: "Home", element: <HomePage />, icon: icons.home },
        { path: "/dashboard", text: "Dashboard", element: <DashboardPage />, icon: icons.dashboard },
        { path: "/colaboradores", text: "Colaboradores", element: <ColaboradoresPage />, icon: icons.colaborator },
        { path: "/onboarding", text: "Onboarding", element: <OnboardingPage />, icon: icons.onboarding },
        { path: "/justificativas", text: "Justificativas", element: <JustificativasPage />, icon: icons.justification },
        { path: "/relatorios", text: "Relatórios", element: <ReportPage />, icon: icons.report },
        { path: "/notificacoes", text: "Notificações", element: <NotificacoesPage />, icon: icons.notification },
        { path: "/configuracoes", text: "Configurações", element: <ConfiguracoesPage />, icon: icons.settings },
    ];

    return (
        <main className="flex min-h-screen bg-gray-100">
            {/* Sidebar dinâmica */}
            <Sidebar isCollapsed={isCollapsed}>
                {routes.map(({ path, text, icon }) => {
                    const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
                    return (
                        <Link key={path} to={path}>
                            <SidebarItem
                                // CORREÇÃO: Passando o ícone JSX diretamente
                                icon={icon}
                                text={text}
                                active={isActive}
                                collapsed={isCollapsed}
                            />
                        </Link>
                    );
                })}
            </Sidebar>

            {/* Conteúdo Principal */}
            <div className="flex-1 overflow-y-auto">
                <Header onToggle={() => setIsCollapsed(!isCollapsed)} />
                <div className="p-3 pt-3">
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        {routes.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                    </Routes>
                </div>
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