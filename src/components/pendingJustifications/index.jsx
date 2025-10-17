import { CheckIcon, XIcon, ClockIcon } from "lucide-react";

function JustificativasPendentes() {
  const justificativas = [
    {
      nome: "Beatriz Frizina",
      cargo: "TI",
      motivo: "Consulta médica",
      data: "15/01",
      prioridade: "Alta prioridade",
      horaRestante: "2h",
    },
    {
      nome: "Raphaela Gomes",
      cargo: "Auxiliar de TI",
      motivo: "Compromisso pessoal",
      data: "20/01",
      prioridade: "Normal",
      horaRestante: "5h",
    },
    {
      nome: "Maria Oliveira",
      cargo: "Financeiro",
      motivo: "Exame de rotina",
      data: "18/01",
      prioridade: "Alta prioridade",
      horaRestante: "1h",
    },{
        nome: "Maria Oliveira",
        cargo: "Financeiro",
        motivo: "Exame de rotina",
        data: "18/01",
        prioridade: "Alta prioridade",
        horaRestante: "1h",
      },

  ];

  return (
    <div className="p-6 rounded-2xl border border-gray-300 bg-gray-50 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <ClockIcon size={20} className="text-blue-500" />
        <h1 className="text-xl font-bold text-gray-800">Justificativas Pendentes</h1>
      </div>

      <div className="space-y-3">
        {justificativas.slice(-3).map((item, index) => {
          const prioridadeClasses =
            item.prioridade === "Alta prioridade"
              ? "bg-red-500 text-white"
              : "bg-green-100 text-green-600";

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg bg-white px-4 py-3 flex items-center justify-between shadow-sm hover:shadow transition"
            >

              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-gray-800">{item.nome}</h3>
                  <span className="text-[10px] border border-gray-300 text-gray-700 px-2 py-0.5 rounded-full">
                    {item.cargo}
                  </span>
                </div>

                <div className="flex items-center text-xs text-gray-500 mt-0.5 space-x-2">
                  <span>{item.motivo}</span>
                  <span>•</span>
                  <span>{item.data}</span>
                  {item.horaRestante && (
                    <>
                      <span>•</span>
                      <span>{item.horaRestante} restantes</span>
                    </>
                  )}
                </div>

                {item.prioridade && (
                  <span
                    className={`mt-1 inline-block px-2 py-0.5 text-[10px] font-medium rounded-full w-fit ${prioridadeClasses}`}
                  >
                    {item.prioridade}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-xs rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition">
                  Informações
                </button>
                <button className="p-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition" onClick={() => {}}>
                  <CheckIcon size={16} />
                </button>
                <button className="p-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                  <XIcon size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default JustificativasPendentes;
