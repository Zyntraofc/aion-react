import UserProfile from "../userProfile";
import { useState, useEffect } from 'react';
import ToogleSidebar from "../toogleSidebar";

function Header({ onToggle }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [nome] = useState('Raphaela')
    const [cargo] = useState('Auxiliar de TI')
    const [email] = useState('raphaela@gmail.com')
    const [foto] = useState('')
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between p-4 mt-1">
                {!isMobile && (
                    <div className="flex items-center space-x-4">
                        <ToogleSidebar onToggle={onToggle} />
                    </div>
                )}
                <div className="flex items-center">
                    <UserProfile nome={nome} cargo={cargo} email={email} foto={foto}/>
                </div>
            </div>
        </div>
    );
}

export default Header;
