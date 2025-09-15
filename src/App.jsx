import { SidebarItem } from "./components/sidebarItem";
import { Sidebar } from "./components/sidebar";
import { LayoutDashboard, BarChart3, HomeIcon, UserIcon, BookIcon, FileIcon, TableConfigIcon, BellIcon } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Importe o Router e as Rotas

// Importe todos os seus componentes de página
import HomePage from "./HomePage";
import DashboardPage from "./DashboardPage";
import ColaboradoresPage from "./ColaboradoresPage";
import OnboardingPage from "./OnboardingPage";
import JustificativasPage from "./JustificativasPage";
import NotificacoesPage from "./NotificacoesPage";
import ConfiguracoesPage from "./ConfiguracoesPage";



export default function App() {
    return (

        <Router> {/* 1. Envolva toda a aplicação com <Router> */}
            <main className="flex min-h-screen bg-gray-100">
                <Sidebar>
                    {/* 2. Use <Link> para cada item da barra lateral */}
                    <Link to="/home">
                        <SidebarItem icon={<HomeIcon size={20} />} text="Home" alert />
                    </Link>
                    <Link to="/dashboard">
                        <SidebarItem icon={<BarChart3 size={20} />} text="Dashboard" />
                    </Link>
                    <Link to="/colaboradores">
                        <SidebarItem icon={<UserIcon size={20} />} text="Colaboradores" />
                    </Link>
                    <Link to="/onboarding">
                        <SidebarItem icon={<BookIcon size={20} />} text="Onboarding" />
                    </Link>
                    <Link to="/justificativas">
                        <SidebarItem icon={<FileIcon size={20} />} text="Justificativas" />
                    </Link>
                    <Link to="/notificacoes">
                        <SidebarItem icon={<BellIcon size={20} />} text="Notificações" />
                    </Link>
                    <Link to="/configuracoes">
                        <SidebarItem icon={<TableConfigIcon size={20} />} text="Configurações" />
                    </Link>
                </Sidebar>

                {/* 3. Defina as rotas */}
                <Routes>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/colaboradores" element={<ColaboradoresPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/justificativas" element={<JustificativasPage />} />
                    <Route path="/notificacoes" element={<NotificacoesPage />} />
                    <Route path="/configuracoes" element={<ConfiguracoesPage />} />
                </Routes>
            </main>
        </Router>
    );
}