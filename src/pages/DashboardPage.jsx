import React from 'react';
import Headers from "../components/header/index.jsx";
import Title from '../components/title/index.jsx';
import Weekly from '../components/weekly/index.jsx';

import JustificativasPendentes from '../components/pendingJustifications/index.jsx';
import QuickInformations from '../components/quickInformations/index.jsx';

function DashboardPage() {
  return(
    <div className='flex-1 flex flex-col'>
      <Headers />
      <Title title="Dashboard" />

      <QuickInformations pendentes={7} aprovadas={3} colaboradoresAtivos={5} taxaAprovacao={80} analise={2}/>

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