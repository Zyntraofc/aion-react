import { SidebarItem } from "./components/sidebarItem";
import { Sidebar } from "./components/sidebar";
import { LayoutDashboard, BarChart3, HomeIcon, UserIcon, BookIcon, FileIcon, TableConfigIcon, BellIcon } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import DashboardPage from "./DashboardPage";
import ColaboradoresPage from "./ColaboradoresPage";
import OnboardingPage from "./OnboardingPage";
import JustificativasPage from "./JustificativasPage";
import NotificacoesPage from "./NotificacoesPage";
import ConfiguracoesPage from "./ConfiguracoesPage";
import { useState } from "react";

export default function App() {
    const [activeItem, setActiveItem] = useState("Dashboard");

    return (
        <Router>
            <main className="flex min-h-screen bg-gray-100">
                {/* Sidebar gerada dinamicamente */}
                <Sidebar>
                    {routes.map(({ path, text, icon }) => (
                        <Link key={path} to={path}>
                            <SidebarItem
                                icon={<img src={icon} alt={text} width={20} height={20} />}
                                text={text}
                            />
                        </Link>
                    ))}
                </Sidebar>

                {/* Rotas geradas dinamicamente */}
                <Routes>
                    {routes.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                    ))}
                </Routes>
            </main>
        </Router>
    );
}