import { SidebarItem } from "./components/sidebarItem/index.jsx";
import { Sidebar } from "./components/sidebar/index.jsx";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import Header from "./components/header/index.jsx";

export default function App() {
    return (
        <main className="flex">
            <Sidebar>
                <SidebarItem
                    icon={<LayoutDashboard size={20} />}
                    text="Dashboard"
                    alert
                />
                <SidebarItem icon={<BarChart3 size={20} />} text="Home" />
                <SidebarItem icon={<BarChart3 size={20} />} text="Dashboard" />
                <SidebarItem icon={<BarChart3 size={20} />} text="Colaboradores" />
                <SidebarItem icon={<BarChart3 size={20} />} text="Onboarding" />
            </Sidebar>
            <Header />

        </main>
    );
}
