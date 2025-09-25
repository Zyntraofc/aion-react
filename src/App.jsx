import { useState } from "react";
import { SidebarItem } from "./components/sidebarItem/index.jsx";
import { Sidebar } from "./components/sidebar/index.jsx";
import {
    homeIcon,
    dashboardIcon,
    colaboratorIcon,
    onboardingIcon,
    justificationIcon,
    notificationIcon,
    settingsIcon,
} from "./assets/icons";
import Header from "./components/header/index.jsx";

export default function App() {
    const [activeItem, setActiveItem] = useState("Dashboard");

    // Mapa de ícones
    const icons = {
        Dashboard: dashboardIcon,
        Home: homeIcon,
        Colaboradores: colaboratorIcon,
        Onboarding: onboardingIcon,
        Justificativa: justificationIcon,
        Notificações: notificationIcon,
        Configurações: settingsIcon,
    };

    // Array de itens do sidebar
    const sidebarItems = [
        "Home",
        "Dashboard",
        "Colaboradores",
        "Onboarding",
        "Justificativa",
        "Notificações",
        "Configurações",
    ];

    return (
        <main className="flex h-screen">
            <Sidebar>
                {sidebarItems.map((item) => (
                    <SidebarItem
                        key={item}
                        text={item}
                        active={activeItem === item}
                        onClick={() => setActiveItem(item)}
                        icon={
                            <img
                                src={icons[item]}
                                alt={item}
                                width={30}
                                height={30}
                            />
                        }
                    />
                ))}
            </Sidebar>
            <Header />
        </main>
    );
}
