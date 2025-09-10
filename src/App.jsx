import { useState } from "react";
import { SidebarItem } from "./components/sidebarItem/index.jsx";
import { Sidebar } from "./components/sidebar/index.jsx";
import { LayoutDashboard, BarChart3 } from "lucide-react";

export default function App() {
    const [activeItem, setActiveItem] = useState("Dashboard");

    return (
        <main className="flex h-screen">
            <Sidebar>
                <SidebarItem
                    icon={<LayoutDashboard size={20} />}
                    text="Dashboard"
                    active={activeItem === "Dashboard"}
                    onClick={() => setActiveItem("Dashboard")}
                />
                <SidebarItem
                    icon={<BarChart3 size={20} />}
                    text="Home"
                    active={activeItem === "Home"}
                    onClick={() => setActiveItem("Home")}
                />
                <SidebarItem
                    icon={<BarChart3 size={20} />}
                    text="Colaboradores"
                    active={activeItem === "Colaboradores"}
                    onClick={() => setActiveItem("Colaboradores")}
                />
                <SidebarItem
                    icon={<BarChart3 size={20} />}
                    text="Onboarding"
                    active={activeItem === "Onboarding"}
                    onClick={() => setActiveItem("Onboarding")}
                />
            </Sidebar>
        </main>
    );
}