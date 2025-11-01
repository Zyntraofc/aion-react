export function SidebarItem({ icon, text, active, alert, onClick, collapsed }) {
    return (
      <li
        onClick={onClick}
        className={`
          relative flex items-center mt-2 py-2 px-4 h-12 my-1
          font-medium rounded-[15px] cursor-pointer transition-all duration-200
          ${
            active
              ? "bg-[radial-gradient(circle_at_top_right,_#7B84FF,_#3A47FF)] text-white shadow-lg"
              : "hover:bg-hover-item text-white"
          }
        `}
      >
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          {icon}
        </div>

        <span
          className={`
            overflow-hidden transition-all duration-300
            text-[0.9rem]
            ${
              collapsed
                ? "w-0 opacity-0 ml-0"
                : "w-auto opacity-100 ml-3 flex-1 min-w-0 truncate"
            }
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
