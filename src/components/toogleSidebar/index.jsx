import toogleSidebar from '../../assets/icons/toggleSideBar.svg';

function ToogleSidebar({ onToggle }) {
    return (
        <button
            onClick={onToggle}
            className="bg-tertiary p-2 rounded-[20%] hover:opacity-80 transition"
        >
            <img src={toogleSidebar} alt="Toggle Sidebar" />
        </button>
    );
}

export default ToogleSidebar;
