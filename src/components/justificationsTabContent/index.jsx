import React, { useState, useEffect, useCallback } from "react";
import ConfigCard from "../configCard";
import SelectGroup from "../selectGroup";
import ToggleSwitch from "../customToggleSwitch";
import ConfigSection from "../configSection";
import axios from "axios";
import {
  Edit,
  Trash2,
  PlusCircle,
  Clock,
  FileText,
  UserCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";

const LS_KEY_PRAZO_ENVIO = "justificativas_prazo_envio";
const LS_KEY_PRAZO_ANALISE = "justificativas_prazo_analise";
const LS_KEY_REQUIRES_APPROVAL = "justificativas_requires_approval";
const LS_KEY_REQUIRES_DOC = "justificativas_requires_doc";
const API_BASE = "https://ms-aion-jpa.onrender.com/api/v1/motivoFalta/";

const loadFromLS = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return defaultValue;

    if (typeof defaultValue === "object" || Array.isArray(defaultValue)) {
      return JSON.parse(saved);
    }
    if (typeof defaultValue === "number") return Number(saved);
    if (typeof defaultValue === "boolean") return saved === "true";

    return saved;
  } catch (error) {
    console.error(`Erro ao carregar ${key} do localStorage:`, error);
    return defaultValue;
  }
};

function JustificativasTabContent() {
  const [prazoEnvio, setPrazoEnvio] = useState(() =>
    loadFromLS(LS_KEY_PRAZO_ENVIO, 3)
  );
  const [prazoAnalise, setPrazoAnalise] = useState(() =>
    loadFromLS(LS_KEY_PRAZO_ANALISE, 2)
  );
  const [requiresApproval, setRequiresApproval] = useState(() =>
    loadFromLS(LS_KEY_REQUIRES_APPROVAL, true)
  );
  const [requiresDoc, setRequiresDoc] = useState(() =>
    loadFromLS(LS_KEY_REQUIRES_DOC, false)
  );

  const [motivos, setMotivos] = useState([]);
  const [newMotivoName, setNewMotivoName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveToLocalStorage = useCallback((key, value) => {
    try {
      const dataToSave =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      localStorage.setItem(key, dataToSave);
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  }, []);

  // Salvar configs locais
  useEffect(() => saveToLocalStorage(LS_KEY_PRAZO_ENVIO, prazoEnvio), [prazoEnvio, saveToLocalStorage]);
  useEffect(() => saveToLocalStorage(LS_KEY_PRAZO_ANALISE, prazoAnalise), [prazoAnalise, saveToLocalStorage]);
  useEffect(() => saveToLocalStorage(LS_KEY_REQUIRES_APPROVAL, requiresApproval), [requiresApproval, saveToLocalStorage]);
  useEffect(() => saveToLocalStorage(LS_KEY_REQUIRES_DOC, requiresDoc), [requiresDoc, saveToLocalStorage]);

  // =========================
  // 📥 LISTAR MOTIVOS
  // =========================
  const fetchMotivos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}listar`);
      setMotivos(response.data);
      setError("");
    } catch (err) {
      console.error("Erro ao buscar motivos de falta:", err);
      setError("Falha ao carregar os motivos de falta.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotivos();
  }, []);

  // =========================
  // ➕ ADICIONAR MOTIVO
  // =========================
  const handleAddMotivo = async () => {
    if (newMotivoName.trim() === "") return;

    const novoMotivo = {
      motivoFalta: newMotivoName.trim(),
      cdEmpresa: 1, // opcional — se tua API exigir
    };

    try {
      setLoading(true);
      await axios.post(`${API_BASE}inserir`, novoMotivo);
      setNewMotivoName("");
      fetchMotivos();
    } catch (err) {
      console.error("Erro ao adicionar motivo de falta:", err);
      alert("Erro ao adicionar motivo de falta.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ❌ REMOVER MOTIVO
  // =========================
  const handleRemoveMotivo = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este motivo de falta?"))
      return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE}remover/${id}`);
      fetchMotivos();
    } catch (err) {
      console.error("Erro ao remover motivo:", err);
      alert("Erro ao remover motivo.");
    } finally {
      setLoading(false);
    }
  };

  const isAddButtonDisabled = newMotivoName.trim() === "";

  return (
    <ConfigCard
      title="Configuração de Justificativas"
      description="Administre os motivos de falta aceitos e defina as regras de prazo e aprovação."
      icon={<Edit size={24} className="text-indigo-600" />}
      className="w-full max-w-3xl"
    >
      {/* --- PRAZOS --- */}
      <ConfigSection
        title="Prazos de Processamento"
        description="Defina os limites de tempo para o envio e análise das justificativas."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectGroup label="Prazo Máximo para Envio (dias)">
            <div className="relative">
              <input
                type="number"
                value={prazoEnvio}
                onChange={(e) => setPrazoEnvio(Number(e.target.value))}
                min="1"
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="3"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </SelectGroup>

          <SelectGroup label="Prazo Máximo para Análise (dias)">
            <div className="relative">
              <input
                type="number"
                value={prazoAnalise}
                onChange={(e) => setPrazoAnalise(Number(e.target.value))}
                min="1"
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="2"
              />
              <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </SelectGroup>
        </div>
      </ConfigSection>

      {/* --- REGRAS --- */}
      <ConfigSection
        title="Requisitos e Regras Gerais"
        description="Habilite ou desabilite regras globais aplicadas a todas as justificativas."
        layout="list"
      >
        <ToggleSwitch
          label="Requer aprovação antes do registro."
          checked={requiresApproval}
          onChange={() => setRequiresApproval(!requiresApproval)}
          icon={<UserCheck className="w-5 h-5 text-indigo-600" />}
        />
        <ToggleSwitch
          label="Requer upload de documento (atestado/comprovante)."
          checked={requiresDoc}
          onChange={() => setRequiresDoc(!requiresDoc)}
          icon={<FileText className="w-5 h-5 text-indigo-600" />}
        />
      </ConfigSection>

      {/* --- LISTAGEM --- */}
      <ConfigSection
        title="Motivos de Falta"
        description="Adicione, remova ou visualize os tipos de motivos de falta disponíveis."
        layout="list"
      >
        {loading && <p className="text-sm text-gray-500 italic">Carregando...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {motivos.map((motivo) => (
          <div
            key={motivo.cdMotivoFalta}
            className="flex items-center justify-between p-3 border-b last:border-b-0"
          >
            <div className="flex items-center flex-1 min-w-0">
              <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
              <span className="font-medium text-gray-800 truncate">
                {motivo.motivoFalta}
              </span>
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <button
                onClick={() => handleRemoveMotivo(motivo.cdMotivoFalta)}
                title={`Excluir ${motivo.motivoFalta}`}
                className="p-1 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </ConfigSection>

      {/* --- ADICIONAR --- */}
      <ConfigSection title="Adicionar Novo Motivo" layout="list">
        <SelectGroup label="Nome do Novo Motivo de Falta">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Atestado, Luto, Consulta médica..."
              value={newMotivoName}
              onChange={(e) => setNewMotivoName(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg flex-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleAddMotivo}
              disabled={isAddButtonDisabled || loading}
              className={`px-4 py-2 flex items-center gap-1 font-semibold rounded-lg shadow-md transition duration-150 ${
                isAddButtonDisabled || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              {loading ? "Adicionando..." : "Adicionar"}
            </button>
          </div>
        </SelectGroup>
      </ConfigSection>
    </ConfigCard>
  );
}

export default JustificativasTabContent;
