import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { useState } from "react";
import Logo from '../../assets/icons/logo_aion.svg';

export function Sidebar({ children }) {

    return (
        <aside className="sm:w-[250px] m-7 flex flex-col">
            <nav className="h-full flex flex-col bg-primary rounded-[25px] shadow-sm p-2 justify-center">
                {/* Header */}
                <div className="p-4 pb-2 flex items-center gap-x-3">
                    <img
                        src={Logo}
                        alt="Logo"
                    />
                    <div>
                        <h3 className="font-semibold text-white">Sistema RH</h3>
                        <h5 className="font-regular text-white font-normal">Gestão de pessoas</h5>
                    </div>
                </div>

                {/* Linha de Gradiente Triplo - Centralizada */}
                <div className="flex justify-center my-2"> {/* Container para centralizar a linha */}
                    <div className="w-9/12 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
                </div>
                {/* Menu */}
                <ul className="flex-1 px-3">{children}</ul>
            </nav>
        </aside>
    );
}