import React, { useEffect, useState } from "react";
import axios from "axios";
import ReclamacoesCard from "../components/reclamacoesCard";
import ReclamacaoModal from "../components/reclamacaoModal";

function ReclamacoesPage() {
  const [reclamacoes, setReclamacoes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [selectedRec, setSelectedRec] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;
  const API_RECLAMACOES = "https://ms-aion-jpa.onrender.com/api/v1/reclamacao/listar";
  const API_TIPOS = "https://ms-aion-jpa.onrender.com/api/v1/tpreclamacao/listar";

  useEffect(() => {
    axios.get(API_RECLAMACOES)
      .then(res => setReclamacoes(res.data || []))
      .catch(err => console.error(err));
    axios.get(API_TIPOS)
      .then(res => setTipos(res.data || []))
      .catch(err => console.error(err));
  }, []);

  const totalPages = Math.ceil(reclamacoes.length / pageSize);
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentRecs = reclamacoes.slice(indexOfFirst, indexOfLast);

  const getTipoNome = (id) => {
    const tipo = tipos.find(t => t.cdTpReclamacao === id);
    return tipo ? tipo.nome : "-";
  };

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="p-6">
      <ReclamacoesCard
        reclamacoes={currentRecs}
        onGerenciar={setSelectedRec}
        getTipoNome={getTipoNome}
      />

      <div className="flex justify-center gap-2 mt-4">
        <button onClick={handlePrev} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded">Anterior</button>
        <span className="px-3 py-1">{currentPage} / {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded">Próximo</button>
      </div>

      {selectedRec && (
        <ReclamacaoModal
          rec={selectedRec}
          getTipoNome={getTipoNome}
          onClose={() => setSelectedRec(null)}
        />
      )}
    </div>
  );
}

export default ReclamacoesPage;
