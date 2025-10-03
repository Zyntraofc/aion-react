export function SidebarItem({ icon, text, active, alert, onClick, collapsed }) {
    return (
        <li
            className={
                "relative flex items-center mt-2 py-2 px-4 h-12 my-1 font-medium rounded-[15px] cursor-pointer transition-colors " +
                (active
                    ? "bg-[radial-gradient(circle_at_top_right,_#7B84FF,_#3A47FF)] text-white" +
                    " backdrop-blur-lg border-1 border-white/30 shadow-lg"
                    : "hover:bg-hover-item text-white")
            }
            onClick={onClick}
        >
            {/* Ícone fixo no tamanho, não encolhe */}
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {icon}
            </div>

            {/* Texto com animação suave */}
            <span
                className={`
          overflow-hidden transition-all duration-300
          text-[0.9rem] whitespace-nowrap
          ${collapsed ? "w-0 opacity-0 ml-0" : "w-40 opacity-100 ml-3"}
        `}
            >
        {text}
      </span>

            {alert && (
                <div className="absolute right-2 w-2 h-2 bg-indigo-400 rounded-full" />
            )}
        </li>
    );
}
