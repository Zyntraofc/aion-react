import React from 'react';
import Title from '../components/title/index.jsx';
import Weekly from '../components/weekly/index.jsx';
import icons from '../assets/icons/index.jsx';
import JustificativasPendentes from '../components/pendingJustifications/index.jsx';
import QuickInformations from '../components/quickInformations/index.jsx';

function DashboardPage() {
  return(
    <div className='flex-1 flex flex-col'>
      <Title title="Dashboard" descrisão={"Acompanhe de maneira geral sua empresa"}/>

        <QuickInformations cards={[
            {title: "Justificativa do Mês", value: 47, icon: icons.justification },
            {title: "Ativos",  value: 47, color: "green"},
            {title: "Inativos",  value: 47 },
            {title: "Departamentos", value: 47 }
        ]}
        />
      <div className='flex p-4'>


        <div className=' p-4 w-3/5'>
          <JustificativasPendentes
            nome={"Raphaela"}
            cargo={"Auxiliar de TI"}
            motivo={"Consulta Médica"}
            data={"23/12"}
            prioridade={"Alta prioridade"}
            horaRestante={"3"}
          />
        </div>
        <div className='p-4 w-2/5'>
          <Weekly
            numberRequestsAproved={3}
            numberRequestsRejected={2}
            aprovedPercentage={80}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage;