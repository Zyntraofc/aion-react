import React from 'react';
import { useState } from 'react';
import {getAuth, signOut} from "firebase/auth";

function UserProfile({ foto, cargo, nome, email }) {
  const [open, setOpen] = useState(false);

  function logOut(){
      const auth = getAuth()
      signOut(auth);
  }

  return (
    <div className="relative flex items-center gap-4 bg-[#9299FF] rounded-full px-3 py-2 text-white">
      <img
        src={foto || "https://avatars.githubusercontent.com/u/9919?s=280&v=4"}
        alt="Foto de perfil"
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-xs opacity-80">{cargo}</span>
        <span className="text-sm font-bold">{nome}</span>
        <span className="text-xs opacity-70">{email}</span>
      </div>
      <span
        onClick={() => setOpen(!open)}
        className="ml-2 cursor-pointer select-none text-xs"
      >
        ▼
      </span>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-l bg-white shadow-lg text-gray-700 z-50">
          <button className="block w-full px-4 py-2 text-left hover:bg-purple-50 cursor-pointer">
            Perfil
          </button>
          <button className="block w-full px-4 py-2 text-left hover:bg-purple-50 cursor-pointer">
            Configurações
          </button>
          <button onClick={logOut} className="block w-full px-4 py-2 text-left text-red-500 hover:bg-purple-50 cursor-pointer">
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;