import React from 'react';
import Headers from "../components/header/index.jsx";
import Title from "../components/title/index.jsx";
import QuickInformations from "../components/quickInformations/index.jsx";
import icons from "../assets/icons/index.jsx";
import JustificativasPendentes from "../components/pendingJustifications/index.jsx";
import Weekly from "../components/weekly/index.jsx";

function ReportPage() {
    return (
        <div className='flex-1 flex flex-col'>
            <Title title="Relatórios" descricao={"Relatório da Gi"}/>

            <QuickInformations cards={[
                {title: "Justificativa do Mês", value: 47, icon: icons.justification},
                {title: "Ativos",  value: 47, color: "green"},
                {title: "Inativos",  value: 47 },
                {title: "Departamentos", value: 47 }
            ]}
            />
        </div>
    );
}

export default ReportPage;