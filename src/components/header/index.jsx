import NotificationIcon from "../notificationsIcon"
import UserProfile from "../userProfile";
import SearchBar from "../searchBar";
import { useState } from 'react';
function Header() {
  const [notificationCount] = useState(30);
  const [nome] = useState('Raphaela')
  const [cargo] = useState('Auxiliar de TI')
  const [email] = useState('raphaela@gmail.com')
  const [foto] = useState('')
  return (
    <div className="w-full">
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-15">
          <ToogleSidebar />
        <NotificationIcon number={notificationCount} />
        <SearchBar />
      </div>
      <div className="flex items-center">
        <UserProfile nome={nome} cargo={cargo} email={email} foto={foto}/>
      </div>
    </div>
    </div>
  );
}

export default Header;