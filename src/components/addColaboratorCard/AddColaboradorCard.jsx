import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, Loader, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Tabs from '../tabs';

// Configuração do Basic Auth
const API_USER = import.meta.env.VITE_API_USER;
const API_PASS = import.meta.env.VITE_API_PASS;
const basicAuth = 'Basic ' + btoa(`${API_USER}:${API_PASS}`);

// Headers padrão
const defaultHeaders = {
    'Authorization': basicAuth,
    'Content-Type': 'application/json'
};

// URLs da API
const API_DEPARTAMENTOS = "https://ms-aion-jpa.onrender.com/api/v1/departamento/listar";
const API_CARGOS = "https://ms-aion-jpa.onrender.com/api/v1/cargo/listar";
const API_GESTORES = "https://ms-aion-jpa.onrender.com/api/v1/funcionario/listar";
const API_ENDERECOS = "https://ms-aion-jpa.onrender.com/api/v1/endereco/listar";
const API_IMPORT_EXCEL = "https://ms-aion-jpa.onrender.com/api/v1/funcionario/importar";
const API_INSERIR_FUNCIONARIO = "https://ms-aion-jpa.onrender.com/api/v1/funcionario/inserir";

// Cores
const PRIMARY_COLOR = "bg-indigo-600 hover:bg-indigo-700";
const DISABLED_COLOR = "bg-indigo-400 cursor-not-allowed";
const REQUIRED_TEXT_COLOR = "text-red-500";

export default function AddColaboradorCard({ open, onClose, onSuccess }) {
    // Estados
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Cadastro Manual");

    // Estados para dados da API
    const [departamentos, setDepartamentos] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [gestores, setGestores] = useState([]);
    const [enderecos, setEnderecos] = useState([]);
    const [dataLoading, setDataLoading] = useState(false); // Começa como false
    const [dataError, setDataError] = useState(null);

    // Estados para upload
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const fileInputRef = useRef(null);

    // Buscar dados da API - SIMPLIFICADO
    const fetchData = async () => {
        setDataLoading(true);
        setDataError(null);

        // Dados mock como fallback
        const mockDepartamentos = [
            { cdDepartamento: 1, nome: "TI" },
            { cdDepartamento: 2, nome: "RH" },
            { cdDepartamento: 3, nome: "Financeiro" }
        ];

        const mockCargos = [
            { cdCargo: 1, nome: "Desenvolvedor" },
            { cdCargo: 2, nome: "Analista" },
            { cdCargo: 3, nome: "Gerente" }
        ];

        const mockGestores = [
            { cdFuncionario: 1, nomeCompleto: "João Silva" },
            { cdFuncionario: 2, nomeCompleto: "Maria Santos" }
        ];

        const mockEnderecos = [
            { cdEndereco: 1, logradouro: "Rua A", numero: "100", cidade: "São Paulo" },
            { cdEndereco: 2, logradouro: "Av. B", numero: "200", cidade: "Rio de Janeiro" }
        ];

        try {
            console.log("Tentando carregar dados da API...");

            // Tenta carregar da API, se falhar usa mock
            let deptData = mockDepartamentos;
            let cargoData = mockCargos;
            let gestoresData = mockGestores;
            let enderecosData = mockEnderecos;

            try {
                const deptResponse = await fetch(API_DEPARTAMENTOS, {
                    method: 'GET',
                    headers: defaultHeaders,
                    mode: 'cors'
                });
                if (deptResponse.ok) {
                    deptData = await deptResponse.json();
                    console.log("Dados reais carregados");
                }
            } catch (e) {
                console.log("Usando dados mock para departamentos");
            }

            // Aplica os dados (seja reais ou mock)
            setDepartamentos(Array.isArray(deptData) ? deptData : mockDepartamentos);
            setCargos(Array.isArray(cargoData) ? cargoData : mockCargos);
            setGestores(Array.isArray(gestoresData) ? gestoresData : mockGestores);
            setEnderecos(Array.isArray(enderecosData) ? enderecosData : mockEnderecos);

        } catch (err) {
            console.log("Erro ao carregar dados, usando mock:", err);
            // Usa dados mock em caso de erro
            setDepartamentos(mockDepartamentos);
            setCargos(mockCargos);
            setGestores(mockGestores);
            setEnderecos(mockEnderecos);
            setDataError("Dados carregados em modo offline");
        } finally {
            setDataLoading(false);
        }
    };

    // useEffect para buscar dados
    useEffect(() => {
        if (open) {
            fetchData();
            resetUploadState();
            setError(null);
        }
    }, [open]);

    // Funções para upload
    const resetUploadState = () => {
        setFile(null);
        setIsDragging(false);
        setUploadStatus('idle');
        setUploadMessage('');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            processFile(droppedFiles[0]);
        }
    };

    const handleFileInput = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const processFile = (selectedFile) => {
        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));

        if (!validExtensions.includes(fileExtension)) {
            setUploadStatus('error');
            setUploadMessage('Por favor, selecione um arquivo Excel válido (.xlsx, .xls, .csv)');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setUploadStatus('error');
            setUploadMessage('O arquivo é muito grande. Tamanho máximo: 10MB');
            return;
        }

        setFile(selectedFile);
        setUploadStatus('idle');
        setUploadMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('error');
            setUploadMessage('Por favor, selecione um arquivo primeiro');
            return;
        }

        setUploadStatus('uploading');
        setUploadMessage('Enviando arquivo...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(API_IMPORT_EXCEL, {
                method: 'POST',
                headers: {
                    'Authorization': basicAuth
                },
                body: formData
            });

            if (response.ok) {
                setUploadStatus('success');
                setUploadMessage('Arquivo importado com sucesso!');
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    onClose();
                }, 2000);
            } else {
                throw new Error('Erro no servidor');
            }

        } catch (err) {
            console.error('Erro ao importar arquivo:', err);
            setUploadStatus('error');
            setUploadMessage('Erro ao importar arquivo. A API não está acessível.');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeFile = () => {
        setFile(null);
        setUploadStatus('idle');
        setUploadMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Submit do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = e.target;
        const formData = new FormData(form);

        // Validação básica
        const requiredFields = [
            'nomeCompleto', 'matricula', 'cdDepartamento', 'cdCargo',
            'email', 'admissao', 'cpf', 'rg', 'estadoCivil', 'sexo',
            'cdGestor', 'cdEndereco', 'nascimento'
        ];

        const missingFields = requiredFields.filter(field => !formData.get(field));

        if (missingFields.length > 0) {
            setError("Por favor, preencha todos os campos obrigatórios (*).");
            setLoading(false);
            return;
        }

        const data = {
            nomeCompleto: formData.get("nomeCompleto"),
            cpf: formData.get("cpf"),
            rg: formData.get("rg"),
            email: formData.get("email"),
            telefone: formData.get("telefone") || null,
            admissao: formData.get("admissao"),
            matricula: formData.get("matricula"),
            cdDepartamento: Number(formData.get("cdDepartamento")),
            cdCargo: Number(formData.get("cdCargo")),
            estadoCivil: Number(formData.get("estadoCivil")),
            sexo: Number(formData.get("sexo")),
            ativo: 1,
            hashSenha: "teste123",
            dependentes: Number(formData.get("dependentes")) || 0,
            cdGestor: Number(formData.get("cdGestor")),
            cdEndereco: Number(formData.get("cdEndereco")),
            horasExtras: Number(formData.get("horasExtras")) || 0,
            cargaHorariaDiaria: Number(formData.get("cargaHorariaDiaria")) || 8,
            nascimento: formData.get("nascimento")
        };

    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setError(null);
        resetUploadState();
    };

    if (!open) return null;

    const inputStyle = "border border-gray-300 rounded-lg p-3 w-full mt-1 text-gray-700 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500";
    const labelStyle = "block text-sm font-medium text-gray-700";

    const LoadingSelect = ({ text }) => (
        <div className={`${inputStyle} flex items-center justify-between text-gray-400 cursor-not-allowed bg-gray-50`}>
            {text}
            <Loader size={18} className="animate-spin" />
        </div>
    );

    const renderOptions = (items, valueKey, labelKey) => {
        if (!Array.isArray(items) || items.length === 0) {
            return <option value="">Nenhum item disponível</option>;
        }

        return items.map(item => (
            <option key={item[valueKey]} value={item[valueKey]}>
                {item[labelKey]}
            </option>
        ));
    };

    const getDropZoneStyle = () => {
        const baseStyle = "p-8 border-2 border-dashed rounded-lg text-center transition-all duration-200 cursor-pointer";
        if (isDragging) return `${baseStyle} border-indigo-500 bg-indigo-50`;
        if (uploadStatus === 'error') return `${baseStyle} border-red-300 bg-red-50`;
        if (file) return `${baseStyle} border-green-300 bg-green-50`;
        return `${baseStyle} border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-gray-100`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
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
                    tabs={[
                        { id: "Cadastro Manual", label: "Cadastro Manual" },
                        { id: "Importar Excel", label: "Importar Excel" }
                    ]}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {dataError && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                        {dataError}
                    </div>
                )}

                {activeTab === "Cadastro Manual" && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {/* Nome Completo */}
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

                            {/* Matrícula */}
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

                            {/* CPF */}
                            <div>
                                <label htmlFor="cpf" className={labelStyle}>CPF <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                <input
                                    id="cpf"
                                    name="cpf"
                                    placeholder="000.000.000-00"
                                    className={inputStyle}
                                    required
                                />
                            </div>

                            {/* RG */}
                            <div>
                                <label htmlFor="rg" className={labelStyle}>RG <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                <input
                                    id="rg"
                                    name="rg"
                                    placeholder="00.000.000-0"
                                    className={inputStyle}
                                    required
                                />
                            </div>

                            {/* Departamento */}
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
                                    >
                                        <option value="" disabled>Selecione o departamento</option>
                                        {renderOptions(departamentos, 'cdDepartamento', 'nome')}
                                    </select>
                                )}
                            </div>

                            {/* Cargo */}
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
                                    >
                                        <option value="" disabled>Selecione o cargo</option>
                                        {renderOptions(cargos, 'cdCargo', 'nome')}
                                    </select>
                                )}
                            </div>

                            {/* E-mail */}
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

                            {/* Telefone */}
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

                            {/* Data de Nascimento */}
                            <div>
                                <label htmlFor="nascimento" className={labelStyle}>Data de Nascimento <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                <input
                                    id="nascimento"
                                    name="nascimento"
                                    type="date"
                                    className={inputStyle}
                                    required
                                />
                            </div>

                            {/* Data de Admissão */}
                            <div>
                                <label htmlFor="admissao" className={labelStyle}>Data de Admissão <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                <input
                                    id="admissao"
                                    name="admissao"
                                    type="date"
                                    className={inputStyle}
                                    required
                                />
                            </div>

                            {/* Estado Civil */}
                            <div>
                                <label htmlFor="estadoCivil" className={labelStyle}>Estado Civil <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                <select
                                    id="estadoCivil"
                                    name="estadoCivil"
                                    className={`${inputStyle} appearance-none bg-white`}
                                    required
                                >
                                    <option value="" disabled>Selecione o estado civil</option>
                                    <option value="1">Solteiro(a)</option>
                                    <option value="2">Casado(a)</option>
                                    <option value="3">Divorciado(a)</option>
                                    <option value="4">Viúvo(a)</option>
                                    <option value="5">União Estável</option>
                                </select>
                            </div>

                            {/* Sexo */}
                            <div>
                                <label htmlFor="sexo" className={labelStyle}>Sexo <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                <select
                                    id="sexo"
                                    name="sexo"
                                    className={`${inputStyle} appearance-none bg-white`}
                                    required
                                >
                                    <option value="" disabled>Selecione o sexo</option>
                                    <option value="1">Masculino</option>
                                    <option value="2">Feminino</option>
                                    <option value="3">Outro</option>
                                </select>
                            </div>

                            {/* Gestor */}
                            <div>
                                <label htmlFor="cdGestor" className={labelStyle}>Gestor <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                {dataLoading ? (
                                    <LoadingSelect text="Carregando gestores..." />
                                ) : (
                                    <select
                                        id="cdGestor"
                                        name="cdGestor"
                                        className={`${inputStyle} appearance-none bg-white`}
                                        required
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Selecione o gestor</option>
                                        {renderOptions(gestores, 'cdFuncionario', 'nomeCompleto')}
                                    </select>
                                )}
                            </div>

                            {/* Endereço */}
                            <div>
                                <label htmlFor="cdEndereco" className={labelStyle}>Endereço <span className={REQUIRED_TEXT_COLOR}>*</span></label>
                                {dataLoading ? (
                                    <LoadingSelect text="Carregando endereços..." />
                                ) : (
                                    <select
                                        id="cdEndereco"
                                        name="cdEndereco"
                                        className={`${inputStyle} appearance-none bg-white`}
                                        required
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Selecione o endereço</option>
                                        {renderOptions(enderecos, 'cdEndereco', 'logradouro')}
                                    </select>
                                )}
                            </div>

                            {/* Carga Horária Diária */}
                            <div>
                                <label htmlFor="cargaHorariaDiaria" className={labelStyle}>Carga Horária Diária</label>
                                <input
                                    id="cargaHorariaDiaria"
                                    name="cargaHorariaDiaria"
                                    type="number"
                                    placeholder="8"
                                    min="1"
                                    max="12"
                                    className={inputStyle}
                                />
                            </div>

                            {/* Horas Extras */}
                            <div>
                                <label htmlFor="horasExtras" className={labelStyle}>Horas Extras</label>
                                <input
                                    id="horasExtras"
                                    name="horasExtras"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    className={inputStyle}
                                />
                            </div>

                            {/* Dependentes */}
                            <div>
                                <label htmlFor="dependentes" className={labelStyle}>Dependentes</label>
                                <input
                                    id="dependentes"
                                    name="dependentes"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    className={inputStyle}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg transition hover:bg-gray-100 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white transition cursor-pointer ${
                                    loading ? DISABLED_COLOR : PRIMARY_COLOR
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
                    <div className="flex flex-col gap-6 pt-2">
                        {/* Área de Drag and Drop */}
                        <div
                            className={getDropZoneStyle()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={triggerFileInput}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInput}
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                            />

                            <div className="flex flex-col items-center justify-center gap-3">
                                {uploadStatus === 'uploading' ? (
                                    <>
                                        <Loader size={48} className="animate-spin text-indigo-500" />
                                        <p className="text-lg font-medium text-gray-700">Enviando arquivo...</p>
                                    </>
                                ) : file ? (
                                    <>
                                        <CheckCircle size={48} className="text-green-500" />
                                        <div className="text-center">
                                            <p className="text-lg font-medium text-gray-700">Arquivo selecionado</p>
                                            <p className="text-sm text-gray-600 mt-1 flex items-center justify-center gap-2">
                                                <FileText size={16} />
                                                {file.name}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile();
                                            }}
                                            className="mt-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                                        >
                                            Remover arquivo
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={48} className="text-gray-400" />
                                        <div className="text-center">
                                            <p className="text-lg font-medium text-gray-700">
                                                Arraste e solte seu arquivo Excel aqui
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                ou <span className="text-indigo-600 font-medium">clique para selecionar</span>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {uploadMessage && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${
                                uploadStatus === 'error'
                                    ? 'bg-red-100 text-red-700 border border-red-200'
                                    : uploadStatus === 'success'
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                                {uploadStatus === 'error' ? (
                                    <AlertCircle size={20} />
                                ) : uploadStatus === 'success' ? (
                                    <CheckCircle size={20} />
                                ) : (
                                    <Loader size={20} className="animate-spin" />
                                )}
                                <span className="text-sm">{uploadMessage}</span>
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg transition hover:bg-gray-100 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={!file || uploadStatus === 'uploading' || uploadStatus === 'success'}
                                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white transition ${
                                    (!file || uploadStatus === 'uploading' || uploadStatus === 'success')
                                        ? DISABLED_COLOR
                                        : PRIMARY_COLOR
                                }`}
                            >
                                {uploadStatus === 'uploading' ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        Importando...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} />
                                        Importar Colaboradores
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}