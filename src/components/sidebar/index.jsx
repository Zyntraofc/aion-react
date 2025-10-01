import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { useState } from "react";
import Logo from '../../assets/icons/logo_aion.svg';

function Sidebar({ children }) {
    return (
        <aside
            className="
                w-64                 /* largura da sidebar em telas >= sm */
                flex flex-col        /* layout vertical */
                sticky               /* fixa no scroll */
                m-6 top-6            /* margens e distância do topo */
                h-[calc(100vh-56px)] /* altura total da tela menos margens */
            "
        >
            <nav
                className="
                    flex flex-col
                    h-full               /* preenche a altura da sidebar */
                    bg-primary         /* fundo */
                    rounded-[25px]       /* bordas arredondadas */
                    shadow-sm            /* sombra leve */
                    p-2                  /* padding interno */
                    justify-start        /* alinha items ao topo */
                "
            >
                {/* Header */}
                <div className="
                    p-4 /* padding */
                    pb-2 /* padding bottom */
                    flex /* display */
                    items-center  /* alinhamento */
                    gap-x-3 /* espaçamento horizontal */
                    ">
                    <img src={Logo} alt="Logo" />
                    <div>
                        <h3 className="font-semibold text-white">Sistema RH</h3>
                        <h5 className="font-normal text-white">Gestão de pessoas</h5>
                    </div>
                </div>

                {/* Linha de gradiente centralizada */}
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
