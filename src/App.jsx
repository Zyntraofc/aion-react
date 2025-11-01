import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ColaboradoresPage from "./pages/ColaboradoresPage.jsx";
import JustificativasPage from "./pages/JustificativasPage.jsx";
import NotificacoesPage from "./pages/NotificacoesPage.jsx";
import ConfiguracoesPage from "./pages/ConfiguracoesPage.jsx";
import ReclamacoesPage from "./pages/ReclamacoesPage.jsx";
import Sidebar from "./components/sidebar";
import { SidebarItem } from "./components/sidebarItem";
import Header from "./components/header/index.jsx";
import icons from "./assets/icons/index.jsx";
import AnimatedPage from "./pages/AnimatedPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ChatbotButton from "./components/chatBotIcon/index.jsx";
import Chatbot from "./components/chatBot/index.jsx";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AnimatePresence } from "framer-motion";

function AppContent() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const auth = getAuth();

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Carregando...
      </div>
    );
  }

  // Caso não autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center font-sans bg-gray-100 relative">
        <div className="fixed left-30 -bottom-2 ">
          {icons.figure}
        </div>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/login"
              element={<AnimatedPage><LoginPage /></AnimatedPage>}
            />
            <Route
              path="/signup"
              element={<AnimatedPage><SignupPage /></AnimatedPage>}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    );
  }

  // Rotas autenticadas
  const routes = [
    { path: "/home", text: "Home", element: <HomePage />, icon: icons.home },
    { path: "/dashboard", text: "Dashboard", element: <DashboardPage />, icon: icons.dashboard },
    { path: "/colaboradores", text: "Colaboradores", element: <ColaboradoresPage />, icon: icons.colaborator },
    { path: "/justificativas", text: "Justificativas", element: <JustificativasPage />, icon: icons.justification },
    { path: "/reclamacoes", text: "Reclamações", element: <ReclamacoesPage />, icon: icons.complaint },
    { path: "/notificacoes", text: "Notificar", element: <NotificacoesPage />, icon: icons.notification },
    { path: "/configuracoes", text: "Configurações", element: <ConfiguracoesPage />, icon: icons.settings },
  ];

  return (
    <main className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed}>
        {routes.map(({ path, text, icon }) => {
          const isActive =
            location.pathname === path ||
            (path !== "/" && location.pathname.startsWith(path));
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
            <Route path="/login" element={<Navigate to="/home" replace />} />
            <Route path="/signup" element={<Navigate to="/home" replace />} />
            <Route path="/" element={<Navigate to="/home" replace />} />

            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </div>
      </div>

      {/* Chatbot fixado no canto inferior direito */}
      <div className="fixed bottom-5 right-5 z-50">
        <ChatbotButton onClick={toggleChatbot} />
      </div>

      {/* Janela do Chatbot */}
      {isChatbotOpen && (
        <div className="fixed bottom-20 right-5 z-50">
          <Chatbot onClose={toggleChatbot} />
        </div>
      )}
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
