import React, {useState} from 'react';
import QuickInformations from "../components/quickInformations/index.jsx";
import Title from "../components/title/index.jsx";
import GenericList from "../components/GenericList/GenericList.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import { Plus } from "lucide-react";
import AddColaboradorCard from "../components/addColaboratorCard/AddColaboradorCard.jsx";


function ColaboradoresPage() {

    const [openCard, setOpenCard] = useState(false);

    return (
        <div className='flex-1 flex flex-col'>
            <div className="flex items-center justify-between w-full">
                <Title
                    title="Colaboradores"
                    descricao="Gerencie informações dos funcionários"
                />
                <div className="bg-tertiary p-4 mr-4 h-8 rounded-lg flex items-center justify-center text-center text-white hover:bg-tertiary/80 cursor-pointer " onClick={() => setOpenCard(true)} >
                    <p>Novo Colaborador</p>
                </div>
            </div>


            <QuickInformations cards={[
                {title: "Total", value: 47},
                {title: "Ativos",  value: 47, color: "green"},
                {title: "Inativos",  value: 47 },
                {title: "Departamentos", value: 47 }
            ]}
            />
            <div className="bg-white p-4 mt-1 mr-4 shadow-md rounded-2xl flex flex-col gap-2">
                <SearchBar/>
                <GenericList resource="colaboradores"
                             visibleColumns={['nomeCompleto','matricula','cdCargo','ativo','actions']}
                />
            </div>
            <AddColaboradorCard
                open={openCard}
                onClose={() => setOpenCard(false)}
                onSuccess={() => console.log("Colaborador criado com sucesso!")}
            />
        </div>
    );
}

export default ColaboradoresPage;