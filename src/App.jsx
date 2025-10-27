import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import React, {useEffect, useState} from "react";
import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ColaboradoresPage from "./pages/ColaboradoresPage.jsx";
import JustificativasPage from "./pages/JustificativasPage.jsx";
import NotificacoesPage from "./pages/NotificacoesPage.jsx";
import ConfiguracoesPage from "./pages/ConfiguracoesPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import ReclamacoesPage from "./pages/ReclamacoesPage.jsx";
import Sidebar  from "./components/sidebar";
import { SidebarItem } from "./components/sidebarItem";
import Header from "./components/header/index.jsx";
import icons from "./assets/icons/index.jsx";
import AnimatedPage from "./pages/AnimatedPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {AnimatePresence} from "framer-motion";

function AppContent() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();

    useEffect(() => {
        // Observa as mudanças de autenticação do Firebase
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user); // true se estiver logado
            setLoading(false); // encerra o estado de carregamento
        });

        return () => unsubscribe();
    }, [auth]);

    // 1. Enquanto o Firebase ainda não respondeu
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-600">
                Carregando...
            </div>
        );
    }

    // 2. Se não estiver logado → Rotas Públicas
    if (!isAuthenticated) {
        // Usa location.pathname como key para forçar a transição
        return (
            <div className="min-h-screen w-full flex items-center justify-center font-sans bg-gray-100 relative">
                <div className="fixed left-30 -bottom-2 ">
                    {icons.figure}
                </div>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        {/* Rota para o Login */}
                        <Route
                            path="/login"
                            element={<AnimatedPage><LoginPage /></AnimatedPage>}
                        />

                        {/* Rota para o Cadastro */}
                        <Route
                            path="/signup"
                            element={<AnimatedPage><SignupPage /></AnimatedPage>}
                        />

                        {/* Qualquer outra rota (incluindo "/") redireciona para o Login */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </AnimatePresence>
            </div>
        );
    }

    // 3. Se estiver logado → Rotas Privadas (App Principal)
    const routes = [
        { path: "/home", text: "Home", element: <HomePage />, icon: icons.home },
        { path: "/dashboard", text: "Dashboard", element: <DashboardPage />, icon: icons.dashboard },
        { path: "/colaboradores", text: "Colaboradores", element: <ColaboradoresPage />, icon: icons.colaborator },
        { path: "/justificativas", text: "Justificativas", element: <JustificativasPage />, icon: icons.justification },
        { path: "/reclamacoes", text: "Reclamações", element: <ReclamacoesPage />, icon: icons.complaint },
        { path: "/relatorios", text: "Relatórios", element: <ReportPage />, icon: icons.report },
        { path: "/notificacoes", text: "Notificar", element: <NotificacoesPage />, icon: icons.notification },
        { path: "/configuracoes", text: "Configurações", element: <ConfiguracoesPage />, icon: icons.settings },

    ];

    return (
        <main className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed}>
                {routes.map(({ path, text, icon }) => {
                    const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
                    return (
                        <Link key={path} to={path}>
                            <SidebarItem
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
                <div className="p-3 pt-0">
                    <Routes>
                        {/* Se logado, bloqueia acesso direto a /login e /signup */}
                        <Route path="/login" element={<Navigate to="/home" replace />} />
                        <Route path="/signup" element={<Navigate to="/home" replace />} />

                        {/* Rota raiz redireciona para a Home */}
                        <Route path="/" element={<Navigate to="/home" replace />} />

                        {/* Rotas principais do aplicativo */}
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