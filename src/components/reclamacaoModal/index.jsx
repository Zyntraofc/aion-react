import React, { useState } from "react";

const ReclamacaoModal = ({ rec, getTipoNome, onClose }) => {
  const [status, setStatus] = useState(rec.status || "E");
  const [respostaRH, setRespostaRH] = useState(rec.respostaRH || "");

  const handleSalvar = () => {
    console.log("Salvando:", { ...rec, status, respostaRH });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fundo semi-transparente */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }} // só mais escuro, sem preto
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg w-11/12 max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{rec.descricao}</h2>
        <p className="mb-2"><strong>Tipo:</strong> {getTipoNome(rec.cdTpReclamacao)}</p>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Status</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="E">Pendente</option>
            <option value="A">Em análise</option>
            <option value="C">Concluída</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Resposta do RH</label>
          <textarea
            className="w-full border rounded px-2 py-1"
            rows={4}
            value={respostaRH}
            onChange={(e) => setRespostaRH(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReclamacaoModal;
