import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { useState } from "react";

export function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <aside className="sm:w-[250px] w-full m-7 rounded-md flex flex-col">
            <nav className="h-full flex flex-col bg-primary border-r shadow-sm">
                {/* Header */}
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img
                        src="https://img.logoipsum.com/243.svg"
                        className={`overflow-hidden transition-all ${
                            expanded ? "w-32" : "w-0"
                        }`}
                        alt="Logo"
                    />
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-primary-100"
                    >
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

                {/* Menu */}
                <ul className="flex-1 px-3">{children}</ul>

            </nav>
        </aside>
    );
}
