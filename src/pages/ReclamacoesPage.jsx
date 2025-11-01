import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ReclamacoesCard from "../components/reclamacoesCard";
import ReclamacaoModal from "../components/reclamacaoModal";
import { Zap } from "lucide-react";

const API_USER = import.meta.env.VITE_API_USER;
const API_PASS = import.meta.env.VITE_API_PASS;

const API_RECLAMACOES = "/api/v1/reclamacao/listar";
const API_TIPOS = "/api/v1/tpReclamacao/listar";
const API_FUNCIONARIOS = "/api/v1/funcionario/listar";

function ReclamacoesPage() {
  const [reclamacoes, setReclamacoes] = useState([]);
  const [tiposMap, setTiposMap] = useState({});
  const [funcionariosMap, setFuncionariosMap] = useState({});
  const [selectedRec, setSelectedRec] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = btoa(`${API_USER}:${API_PASS}`);
  const authConfig = { headers: { Authorization: `Basic ${auth}` } };

  // --- Busca de dados ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tiposRes, funcRes, recsRes] = await Promise.all([
        axios.get(API_TIPOS, authConfig),
        axios.get(API_FUNCIONARIOS, authConfig),
        axios.get(API_RECLAMACOES, authConfig),
      ]);

      const tiposMapData = tiposRes.data.reduce((map, tipo) => {
        map[tipo.cdTpReclamacao] = tipo.nome;
        return map;
      }, {});
      setTiposMap(tiposMapData);

      const funcMapData = funcRes.data.reduce((map, func) => {
        map[func.cdMatricula] = func.nomeCompleto;
        return map;
      }, {});
      setFuncionariosMap(funcMapData);

      setReclamacoes(recsRes.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Erro na API");
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getTipoNome = useCallback((id) => tiposMap[id] || "-", [tiposMap]);
  const getFuncionarioNome = useCallback((id) => funcionariosMap[id] || "-", [funcionariosMap]);

  // --- Abrir modal ---
  const handleGerenciar = (reclamacao) => setSelectedRec(reclamacao);

  // --- Atualizar resposta do RH ---
  const handleResponder = async (resposta) => {
    if (!resposta) return;
    try {
      await axios.patch(`/api/v1/reclamacao/atualizar/parcial/${selectedRec.cdReclamacao}`, {
        resposta,
      }, authConfig);

      alert("Resposta enviada com sucesso!");
      setSelectedRec(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Falha ao enviar resposta: " + (err.response?.data?.message || err.message));
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-600">
      <Zap size={24} className="animate-spin text-indigo-500" />
      Carregando dados...
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md mx-auto max-w-lg mt-10" role="alert">
      <strong>Erro:</strong> {error}
      <button onClick={fetchData} className="ml-4 underline text-red-700">Tentar Novamente</button>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Painel de Reclamações</h1>

      <ReclamacoesCard
        reclamacoes={reclamacoes}
        onGerenciar={handleGerenciar}
        getTipoNome={getTipoNome}
        getFuncionarioNome={getFuncionarioNome}
      />

      {selectedRec && (
        <ReclamacaoModal
          rec={selectedRec}
          getTipoNome={getTipoNome}
          getFuncionarioNome={getFuncionarioNome}
          onClose={() => setSelectedRec(null)}
          onResponder={handleResponder}
        />
      )}
    </div>
  );
}

export default ReclamacoesPage;
