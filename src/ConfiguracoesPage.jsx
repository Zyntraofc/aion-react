import React from 'react';
import Headers from "./components/header";
import Title from './components/title';
import Permissions from './components/permissions';

function ColaboradoresPage() {
    return (
<div className="flex-1 flex flex-col">
    <Headers />
    <Title title="Configurações" descrisão={"Configurações do sistema"} />
    <Permissions />

</div>
    );
}

export default ColaboradoresPage;