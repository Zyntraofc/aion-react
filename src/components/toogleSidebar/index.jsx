// ToogleSidebar.jsx
import toogleSidebar from '../../assets/icons/toggleSideBar.svg';

function ToogleSidebar({ onToggle, isMobile }) {
  if (!isMobile) return null;

  return (
    <button
      onClick={onToggle}
      className="bg-tertiary p-2 rounded-[20%] hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <img src={toogleSidebar} alt="Toggle Sidebar" className="w-6 h-6" />
    </button>
  );
}

export default ToogleSidebar;
