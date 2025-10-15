import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, Loader } from "lucide-react";
import axios from "axios";
import Tabs from '../tabs'; // Ajuste o caminho se necessário

// As URLs de API foram atualizadas com '/listar'
const API_DEPARTAMENTOS = "https://ms-aion-jpa.onrender.com/api/v1/departamento/listar";
const API_CARGOS = "https://ms-aion-jpa.onrender.com/api/v1/cargo/listar";

// Cores baseadas em padrões Tailwind/Indigo
const PRIMARY_COLOR = "bg-indigo-600 hover:bg-indigo-700";
const DISABLED_COLOR = "bg-indigo-400 cursor-not-allowed";
const REQUIRED_TEXT_COLOR = "text-red-500"; // Mantendo vermelho para obrigatório

export default function AddColaboradorCard({ open, onClose, onSuccess }) {
    // 1. Estados
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Cadastro Manual");

    // Estados para armazenar os dados puxados da API
    const [departamentos, setDepartamentos] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState(null);

    // --- FUNÇÕES DE BUSCA DE DADOS DA API ---
    const fetchData = async () => {
        setDataLoading(true);
        setDataError(null);
        try {
            // Busca de Departamentos
            const deptResponse = await axios.get(API_DEPARTAMENTOS);
            setDepartamentos(deptResponse.data);

            // Busca de Cargos
            const cargoResponse = await axios.get(API_CARGOS);
            setCargos(cargoResponse.data);

        } catch (err) {
            console.error("❌ Erro ao carregar dados dos dropdowns:", err);
            setDataError("Não foi possível carregar departamentos e cargos. Tente novamente.");
        } finally {
            setDataLoading(false);
        }
    };

    // 2. Hook useEffect: Busca os dados ao abrir o modal
    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    // 3. Retorno Condicional
    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (activeTab !== "Cadastro Manual") return;

        const form = new FormData(e.target);

        const nomeCompleto = form.get("nomeCompleto");
        const email = form.get("email");
        const telefone = form.get("telefone");
        const admissao = form.get("admissao");
        const matricula = form.get("matricula");
        const cdDepartamento = Number(form.get("cdDepartamento"));
        const cdCargo = Number(form.get("cdCargo"));

        const data = {
            nomeCompleto: nomeCompleto,
            cpf: "559.478.928-63", // Mock
            rg: "73.123.123-5", // Mock
            email: email,
            telefone: telefone || null,
            admissao: admissao,
            matricula: matricula,
            cdDepartamento: cdDepartamento,
            cdCargo: cdCargo,
            estadoCivil: 1, // Mock
            sexo: 1, // Mock
            ativo: 1,
            hashSenha: "teste123", // Mock
            dependentes: 0, // Mock
            cdGestor: 1, // Mock
            cdEndereco: 1, // Mock
            horasExtras: 0, // Mock
            cargaHorariaDiaria: 8, // Mock
            nascimento: "1990-01-01" // Mock
        };

        if (!nomeCompleto || !matricula || !cdDepartamento || !cdCargo || !email || !admissao) {
            setError("Por favor, preencha todos os campos obrigatórios (*).");
            setLoading(false);
            return;
        }

        try {
            await axios.post("https://ms-aion-jpa.onrender.com/api/v1/funcionario/inserir", data, {
                headers: { "Content-Type": "application/json" }
            });

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error("❌ Erro ao salvar colaborador:", err);
            const errorMessage = err.response?.data?.message;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setError(null);
    };

    const inputStyle = "border border-gray-300 rounded-lg p-3 w-full mt-1 text-gray-700 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500";
    const labelStyle = "block text-sm font-medium text-gray-700";

    const LoadingSelect = ({ text }) => (
        <div className={`${inputStyle} flex items-center justify-between text-gray-400 cursor-not-allowed bg-gray-50`}>
            {text}
            <Loader size={18} className="animate-spin" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 flex flex-col gap-4 relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 pb-4">
                    <UserPlus size={24} className="text-gray-800" />
                    <h2 className="text-xl font-semibold text-gray-800">
                        Adicionar Colaborador
                    </h2>
                </div>

                <Tabs
                    tabs={["Cadastro Manual", "Importar Excel"]}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {activeTab === "Cadastro Manual" && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">

                        {dataError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{dataError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                            {/* Linha 1: Nome Completo e Matrícula */}
                            <div>
                                <label htmlFor="nomeCompleto" className={labelStyle}>Nome Completo <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                <input
                                    id="nomeCompleto"
                                    name="nomeCompleto"
                                    placeholder="Digite o nome completo"
                                    className={inputStyle}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="matricula" className={labelStyle}>Matrícula <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                <input
                                    id="matricula"
                                    name="matricula"
                                    placeholder="Ex: 2024001"
                                    className={inputStyle}
                                    required
                                />
                            </div>

                            {/* Linha 2: Departamento (CORRIGIDO) */}
                            <div>
                                <label htmlFor="cdDepartamento" className={labelStyle}>Departamento <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                {dataLoading ? (
                                    <LoadingSelect text="Carregando departamentos..." />
                                ) : (
                                    <select
                                        id="cdDepartamento"
                                        name="cdDepartamento"
                                        className={`${inputStyle} appearance-none bg-white`}
                                        required
                                        defaultValue=""
                                        disabled={dataError}
                                    >
                                        <option value="" disabled>Selecione o departamento</option>
                                        {departamentos.map(dep => (
                                            // USANDO dep.nome
                                            <option key={dep.cdDepartamento} value={dep.cdDepartamento}>{dep.nome}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Linha 2: Cargo (CORRIGIDO) */}
                            <div>
                                <label htmlFor="cdCargo" className={labelStyle}>Cargo <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                {dataLoading ? (
                                    <LoadingSelect text="Carregando cargos..." />
                                ) : (
                                    <select
                                        id="cdCargo"
                                        name="cdCargo"
                                        className={`${inputStyle} appearance-none bg-white`}
                                        required
                                        defaultValue=""
                                        disabled={dataError}
                                    >
                                        <option value="" disabled>Selecione o cargo</option>
                                        {cargos.map(cargo => (
                                            // USANDO cargo.nome
                                            <option key={cargo.cdCargo} value={cargo.cdCargo}>{cargo.nome}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Linha 3: E-mail e Telefone */}
                            <div>
                                <label htmlFor="email" className={labelStyle}>E-mail <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                <input
                                    id="email"
                                    name="email"
                                    placeholder="email@empresa.com"
                                    type="email"
                                    className={inputStyle}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="telefone" className={labelStyle}>Telefone</label>
                                <input
                                    id="telefone"
                                    name="telefone"
                                    placeholder="(00) 00000-0000"
                                    type="tel"
                                    className={inputStyle}
                                />
                            </div>

                            {/* Linha 4: Data de Admissão (Campo Único) */}
                            <div className="md:col-span-2">
                                <label htmlFor="admissao" className={labelStyle}>Data de Admissão <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                <input
                                    id="admissao"
                                    name="admissao"
                                    type="date"
                                    className={inputStyle}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                        {/* Botões de Ação */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg transition hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || dataLoading || dataError}
                                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white transition ${
                                    (loading || dataLoading || dataError)
                                        ? DISABLED_COLOR
                                        : PRIMARY_COLOR
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={20} />
                                        Adicionar Colaborador
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === "Importar Excel" && (
                    <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                        <p className="text-gray-600">
                            Funcionalidade de **Importar Excel** em desenvolvimento.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Arraste e solte o arquivo ou clique para selecionar.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}