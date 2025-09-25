export function SidebarItem({ icon, text, active, alert, onClick }) {
    return (
        <li
            className={
                "relative flex items-center mt-2 py-2 px-4 h-12 my-1 font-medium rounded-[15px] cursor-pointer transition-colors " +
                (active
                    ? "bg-selected-item text-white"
                    : "hover:bg-hover-item text-white")
            }
            onClick={onClick}
        >
            {icon}
            <span className="w-52 ml-3 text-[0.9rem]">{text}</span>
            {alert && (
                <div className="absolute right-2 w-2 h-2 bg-indigo-400"/>
            )}
        </li>
    );
}