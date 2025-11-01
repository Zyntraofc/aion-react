import React from 'react';
import Title from '../components/title';
import QuickInformations from '../components/quickInformations';
import icons from '../assets/icons';

function DashboardPage() {
  const powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiYWFiNDZkZGMtMWI4MS00N2EwLTg0NDktZWFmZjI2OTQzODQ1IiwidCI6ImIxNDhmMTRjLTIzOTctNDAyYy1hYjZhLTFiNDcxMTE3N2FjMCJ9";
  const quickCards = [
    { title: "Justificativa do Mês", value: 47, icon: icons.justification },
    { title: "Presença Média", value: 99.9, color: "green", subtitle: "%" },
    { title: "Tempo médio de resposta", value: 47 },
    { title: "Performance excelente", value: 47 }
  ];

  return (
    <div className="flex-1 flex flex-col p-4">
      <Title title="Dashboard" descricao="Acompanhe de maneira geral sua empresa" />

      <QuickInformations cards={quickCards} />

      <div className="mt-8 w-full flex-1 min-h-[70vh] rounded-xl overflow-hidden
                bg-gradient-to-br from-white via-gray-50 to-gray-100
                shadow-2xl border border-gray-200
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl" style={{ minHeight: '70vh' }}>

        <iframe
          title="Relatório da Empresa"
          src={powerBiUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            minHeight: '70vh'
          }}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
