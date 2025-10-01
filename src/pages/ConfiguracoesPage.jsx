import React from 'react';
import Headers from "../components/header/index.jsx";
import Title from '../components/title/index.jsx';
import Permissions from '../components/permissions/index.jsx';

function ColaboradoresPage() {
    return (
<div className="flex-1 flex flex-col">
    <div />
    <Title title="Configurações" descrisão={"Configurações do sistema"} />
    <Permissions />

</div>
    );
}

export default ColaboradoresPage;