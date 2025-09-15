import { SidebarItem } from "./components/sidebarItem";
import { Sidebar } from "./components/sidebar";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import Header from "./components/header";
import QuickInformations from "./components/quickInformations";
import Title from "./components/title";
import QuickActions from "./components/quickActions";
import Recent from "./components/recent";


export default function App() {
    return (
        <main className="flex min-h-screen bg-gray-100">
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
        </main>
    );
}
