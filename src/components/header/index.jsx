import UserProfile from "../userProfile";
import { useState } from 'react';
import ToogleSidebar from "../toogleSidebar";

function Header({ onToggle }) {
    const [nome] = useState('Raphaela')
    const [cargo] = useState('Auxiliar de TI')
    const [email] = useState('raphaela@gmail.com')
    const [foto] = useState('')

    return (
        <div className="w-full">
            <div className="flex items-center justify-between p-4 mt-1">
                <div className="flex items-center space-x-4">
                    <ToogleSidebar onToggle={onToggle} />
                </div>
                <div className="flex items-center">
                    <UserProfile nome={nome} cargo={cargo} email={email} foto={foto}/>
                </div>
            </div>
        </div>
    );
}

export default Header;
