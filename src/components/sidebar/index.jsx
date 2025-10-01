import Logo from '../../assets/icons/logo_aion.svg';
import { useState } from "react";

function Sidebar({ children, isCollapsed }) {
    return (
        <aside
            className={`
                ${isCollapsed ? "w-20" : "w-64"} 
                flex flex-col
                sticky
                m-6 top-6
                h-[calc(100vh-56px)]
                transition-all duration-300
            `}
        >
            <nav
                className="
                    flex flex-col
                    h-full
                    bg-tertiary
                    rounded-[25px]
                    shadow-sm
                    p-2
                    justify-start
                "
            >
                {/* Header */}
                <div className="flex items-center p-4 pb-2 gap-x-3">
                    {!isCollapsed && (
                        <>
                            <img src={Logo} alt="Logo" />
                            <div>
                                <h3 className="font-semibold text-white">Sistema RH</h3>
                                <h5 className="font-normal text-white">Gestão de pessoas</h5>
                            </div>
                        </>
                    )}
                </div>

                {/* Linha de gradiente */}
                <div className="flex justify-center my-2">
                    <div className="w-9/12 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
                </div>

                {/* Menu */}
                <ul className="flex-1 px-3">
                    {children}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;