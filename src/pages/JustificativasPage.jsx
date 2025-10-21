import React from 'react';
import Headers from "../components/header/index.jsx";
import Title from "../components/title/index.jsx";
import QuickInformations from "../components/quickInformations/index.jsx";
import icons from "../assets/icons/index.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import GenericList from "../components/GenericList/GenericList.jsx";

function JustificativasPage() {
    return(
        <div className='flex-1 flex flex-col'>
            <Title title="Justificativa" descricao={"Gerencie e analise justificativas de ausência."}/>
            <QuickInformations cards={[
                {title: "Pendentes", value: 2, color: "yellow", subtitle: "Total recebidas: 12%"},
                {title: "Aprovadas",  value: 1, color: "green"},
                {title: "Recusadas",  value: 1 , color: "red"},
                {title: "Total", value: 4}
            ]}
            />

            <div className="bg-white p-4 mt-1 mr-4 shadow-md rounded-2xl flex flex-col gap-2">
                <SearchBar/>
                <GenericList
                    resource="justificativas"

                    visibleColumns={[
                        'dataHoraBatida',
                        'cdFuncionario',
                        'justificativa',
                        'status',
                        'situacao',
                        'actions',
                    ]}
                />
            </div>

        </div>
    )
}
export default JustificativasPage;