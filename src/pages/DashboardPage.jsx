import React from 'react';
import Title from '../components/title/index.jsx';
import Weekly from '../components/weekly/index.jsx';
import icons from '../assets/icons/index.jsx';
import JustificativasPendentes from '../components/pendingJustifications/index.jsx';
import QuickInformations from '../components/quickInformations/index.jsx';

function DashboardPage() {
  return(
    <div className='flex-1 flex flex-col'>
      <Title title="Dashboard" descricao={"Acompanhe de maneira geral sua empresa"}/>

        <QuickInformations cards={[
            {title: "Justificativa do Mês", value: 47, icon: icons.justification},
            {title: "Presença Média",  value: 99.9, color: "green", subtitle: "%"},
            {title: "Tempo médio de resposta",  value: 47 },
            {title: "Performance excelente", value: 47 }
        ]}
        />
    </div>
  )
}

export default DashboardPage;