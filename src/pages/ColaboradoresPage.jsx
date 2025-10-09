import React from 'react';
import Headers from "../components/header/index.jsx";
import QuickInformations from "../components/quickInformations/index.jsx";
import Title from "../components/title/index.jsx";
import GenericList from "../components/GenericList/GenericList.jsx";

function ColaboradoresPage() {
    return (
        <div className='flex-1 flex flex-col'>
            <Title title="Colaboradores" descrisão={"Gerencie informações dos funcionários"}/>
            <QuickInformations cards={[
                {title: "Total", value: 47},
                {title: "Ativos",  value: 47, color: "green"},
                {title: "Inativos",  value: 47 },
                {title: "Departamentos", value: 47 }
            ]}
            />

            <GenericList resource="colaboradores" visibleColumns={['name','email','role','status','actions']} />;
        </div>
    );
}

export default ColaboradoresPage;