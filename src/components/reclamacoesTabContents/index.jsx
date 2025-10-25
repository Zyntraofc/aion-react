import React, { useState, useEffect } from "react";
import ConfigCard from "../configCard";
import ConfigSection from "../configSection";
import ToggleSwitch from "../customToggleSwitch";
import { AlertCircleIcon, Trash2, CheckCircle, XCircle, PlusCircle } from "lucide-react";
import SelectGroup from "../selectGroup";
import axios from "axios";

const API_BASE = "https://ms-aion-jpa.onrender.com/api/v1/tpReclamacao";

function ReclamacoesTabContent() {
  const [tipos, setTipos] = useState([]);
  const [newNome, setNewNome] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar todos os tipos ao montar o componente
  useEffect(() => {
    listarTipos();
  }, []);

  const listarTipos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/listar`);
      setTipos(response.data);
    } catch (error) {
      console.error("Erro ao listar tipos de reclamação:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Adicionar novo tipo
  const handleAdd = async () => {
    if (!newNome.trim()) return;
    try {
      const response = await axios.post(`${API_BASE}/inserir`, {
        nome: newNome,
        ativo: "1",
      });
      setTipos((prev) => [response.data, ...prev]);
      setNewNome("");
    } catch (error) {
      console.error("Erro ao adicionar tipo:", error);
    }
  };

  // 🔹 Remover tipo
  const handleRemove = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este tipo?")) return;
    try {
      await axios.delete(`${API_BASE}/remover/${id}`);
      setTipos((prev) => prev.filter((t) => t.cdTpReclamacao !== id));
    } catch (error) {
      console.error("Erro ao remover tipo:", error);
    }
  };

  // 🔹 Ativar / Desativar tipo
  const handleToggle = async (tipo) => {
    const endpoint = tipo.ativo === "1" ? "desativar" : "ativar";
    try {
      await axios.patch(`${API_BASE}/${endpoint}/${tipo.cdTpReclamacao}`);
      setTipos((prev) =>
        prev.map((t) =>
          t.cdTpReclamacao === tipo.cdTpReclamacao
            ? { ...t, ativo: tipo.ativo === "1" ? "0" : "1" }
            : t
        )
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

  const isAddButtonDisabled = !newNome.trim();

  return (
    <ConfigCard title="Reclamações" icon={<AlertCircleIcon className="w-6 h-6" />}>
      <div className="space-y-6">
        <ConfigSection
          title="Tipos de Reclamação"
          description="Gerencie os tipos disponíveis de reclamações na empresa."
          layout="list"
        >
          {loading ? (
            <p className="text-gray-500 italic">Carregando tipos...</p>
          ) : tipos.length === 0 ? (
            <p className="text-gray-500 italic">Nenhum tipo cadastrado.</p>
          ) : (
            tipos.map((tipo) => (
              <div
                key={tipo.cdTpReclamacao}
                className="flex items-center justify-between p-3 border-b last:border-b-0"
              >
                <div className="flex items-center flex-1 min-w-0">
                  {tipo.ativo === "1" ? (
                    <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-3 text-gray-400" />
                  )}
                  <span
                    className={`font-medium truncate ${
                      tipo.ativo === "1"
                        ? "text-gray-800"
                        : "text-gray-400 italic"
                    }`}
                  >
                    {tipo.nome}
                  </span>
                </div>

                <div className="flex items-center space-x-4 ml-4">
                  <button
                    onClick={() => handleRemove(tipo.cdTpReclamacao)}
                    title={`Excluir ${tipo.nome}`}
                    className="p-1 rounded-full text-red-500 hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ToggleSwitch
                    checked={tipo.ativo === "1"}
                    onChange={() => handleToggle(tipo)}
                  />
                </div>
              </div>
            ))
          )}
        </ConfigSection>

        <ConfigSection title="Adicionar Novo Tipo" layout="list">
          <SelectGroup label="Nome do Novo Tipo de Reclamação">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Técnico, Desentendimento..."
                value={newNome}
                onChange={(e) => setNewNome(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg flex-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleAdd}
                disabled={isAddButtonDisabled}
                className={`px-4 py-2 flex items-center gap-1 font-semibold rounded-lg shadow-md transition duration-150 ${
                  isAddButtonDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                Adicionar
              </button>
            </div>
          </SelectGroup>
        </ConfigSection>
      </div>
    </ConfigCard>
  );
}

export default ReclamacoesTabContent;
