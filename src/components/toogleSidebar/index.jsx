
import toggleSidebarIcon from '../../assets/icons/toggleSideBar.svg';

function ToogleSidebar({ onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="hidden lg:flex bg-tertiary p-2 rounded-[20%] hover:opacity-80 transition
                 "
      title="Fechar/abrir menu lateral"
    >
      <img
        src={toggleSidebarIcon}
        alt="Toggle Sidebar"
        className="w-6 h-6"
      />
    </button>
  );
}

export default ToogleSidebar;
