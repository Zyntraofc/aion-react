import React from 'react';
import Headers from "./components/header";
import Title from './components/title';
import Weekly from './components/weekly';

import JustificativasPendentes from './components/pendingJustifications';
import QuickInformations from './components/quickInformations';

function DashboardPage() {
  return(
    <div className='flex-1 flex flex-col'>
      <Headers />
      <Title title="Dashboard" />

      <QuickInformations pendentes={7} aprovadas={3} colaboradoresAtivos={5} taxaAprovacao={80} analise={2}/>

      {/* Container principal para as duas colunas */}
      <div className='flex p-4'>

        {/* Coluna da esquerda */}
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

        {/* Coluna da direita */}
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