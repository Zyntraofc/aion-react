
import React, { useState } from 'react';
import { Menu, X, Home, Users, BarChart2 } from 'lucide-react';
import Sidebar from './Sidebar';
import { SidebarItem } from './SidebarItem';

function Layout({ children }) {
const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const itemIsCollapsed = isCollapsed && !isMobileOpen;

    const handleNavigation = () => {
        setIsMobileOpen(false);
    };

    return (
        <div className="flex min-h-screen">

            <button
                className="lg:hidden fixed top-4 left-4 z-[90] p-2 rounded-lg bg-blue-600 text-white shadow-xl transition-all duration-300 transform"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Sidebar
                isCollapsed={isCollapsed}
                isMobileOpen={isMobileOpen}
                setMobileOpen={setIsMobileOpen}
            >
                <SidebarItem
                    icon={<Home size={20} />}
                    text="Início"
                    active={true}
                    collapsed={itemIsCollapsed}
                    onClick={handleNavigation}
                />
                <SidebarItem
                    icon={<Users size={20} />}
                    text="Colaboradores (Item Longo de Teste)"
                    alert={true}
                    collapsed={itemIsCollapsed}
                    onClick={handleNavigation}
                />
                <SidebarItem
                    icon={<BarChart2 size={20} />}
                    text="Relatórios"
                    collapsed={itemIsCollapsed} =A
                    onClick={handleNavigation}
                />
            </Sidebar>

            {/* Conteúdo Principal */}
            <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6">
                {children}
            </main>
        </div>
    );
}
export default Layout;