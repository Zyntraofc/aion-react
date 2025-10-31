import Logo from "../../assets/icons/logo_aion.svg";

function Sidebar({ children, isCollapsed, isMobileOpen, setMobileOpen }) {
  const isHeaderCollapsed = isCollapsed && !isMobileOpen;

  return (
    <>
      {/* Overlay escuro no mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 lg:top-6 left-0 z-30
          h-full lg:h-[calc(100vh-48px)]
          bg-transparent
          transform transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "lg:w-24" : "lg:w-64"}
          lg:translate-x-0
          lg:m-6 lg:mr-2
          flex flex-col
        `}
      >
        <nav
          className="flex flex-col h-full w-full bg-tertiary rounded-[25px] shadow-xl p-2 relative z-30 justify-start"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`flex items-center p-4 pb-2 transition-all duration-300
              ${isHeaderCollapsed ? "justify-center" : "justify-start gap-x-3"}`}
          >
            <img
              src={Logo}
              alt="Logo"
              className="w-10 h-10 transition-all duration-300"
            />

            <div
              className={`
                overflow-hidden transition-all duration-300
                ${isHeaderCollapsed ? "w-0 opacity-0" : "w-40 opacity-100"}
              `}
            >
              <h3 className="font-semibold text-white whitespace-nowrap">
                Sistema RH
              </h3>
              <h5 className="font-normal text-white whitespace-nowrap">
                Gestão de pessoas
              </h5>
            </div>
          </div>

          {/* Linha separadora */}
          <div className="flex justify-center my-2">
            <div className="w-9/12 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>

          {/* Itens do menu */}
          <ul className="flex-1 px-3 overflow-y-auto">{children}</ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
