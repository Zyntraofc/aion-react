import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, Loader, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import Tabs from '../tabs'; // Ajuste o caminho se necessário

// As URLs de API foram atualizadas com '/listar'
const API_DEPARTAMENTOS = "https://ms-aion-jpa.onrender.com/api/v1/departamento/listar";
const API_CARGOS = "https://ms-aion-jpa.onrender.com/api/v1/cargo/listar";
const API_GESTORES = "https://ms-aion-jpa.onrender.com/api/v1/funcionario/listar";
const API_ENDERECOS = "https://ms-aion-jpa.onrender.com/api/v1/endereco/listar";
const API_IMPORT_EXCEL = "https://ms-aion-jpa.onrender.com/api/v1/funcionario/importar"; // Supondo que existe essa rota

// Cores baseadas em padrões Tailwind/Indigo
const PRIMARY_COLOR = "bg-indigo-600 hover:bg-indigo-700";
const DISABLED_COLOR = "bg-indigo-400 cursor-not-allowed";
const REQUIRED_TEXT_COLOR = "text-red-500";

export default function AddColaboradorCard({ open, onClose, onSuccess }) {
    // 1. Estados
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Cadastro Manual");

    // Estados para armazenar os dados puxados da API
    const [departamentos, setDepartamentos] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [gestores, setGestores] = useState([]);
    const [enderecos, setEnderecos] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState(null);

    // Estados para upload de Excel
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
    const [uploadMessage, setUploadMessage] = useState('');
    const fileInputRef = useRef(null);

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

            // Busca de Gestores
            const gestoresResponse = await axios.get(API_GESTORES);
            setGestores(gestoresResponse.data);

            // Busca de Endereços
            const enderecosResponse = await axios.get(API_ENDERECOS);
            setEnderecos(enderecosResponse.data);

        } catch (err) {
            console.error("❌ Erro ao carregar dados dos dropdowns:", err);
            setDataError("Não foi possível carregar alguns dados. Tente novamente.");
        } finally {
            setDataLoading(false);
        }
    };

    // 2. Hook useEffect: Busca os dados ao abrir o modal
    useEffect(() => {
        if (open) {
            fetchData();
            // Resetar estados de upload quando abrir o modal
            resetUploadState();
        }
    }, [open]);

    // Funções para manipulação de arquivos Excel
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
        // Validar se é um arquivo Excel
        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
        
        if (!validExtensions.includes(fileExtension)) {
            setUploadStatus('error');
            setUploadMessage('Por favor, selecione um arquivo Excel válido (.xlsx, .xls, .csv)');
            return;
        }

        // Validar tamanho do arquivo (max 10MB)
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
            const response = await axios.post(API_IMPORT_EXCEL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 30000 // 30 segundos timeout
            });

            setUploadStatus('success');
            setUploadMessage('Arquivo importado com sucesso! Colaboradores serão processados em breve.');
            
            // Limpar o arquivo após sucesso
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 2000);

        } catch (err) {
            console.error('❌ Erro ao importar arquivo Excel:', err);
            setUploadStatus('error');
            setUploadMessage(err.response?.data?.message || 'Erro ao importar arquivo. Tente novamente.');
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
        const cpf = form.get("cpf");
        const rg = form.get("rg");
        const estadoCivil = Number(form.get("estadoCivil"));
        const sexo = Number(form.get("sexo"));
        const dependentes = Number(form.get("dependentes")) || 0;
        const cdGestor = Number(form.get("cdGestor"));
        const cdEndereco = Number(form.get("cdEndereco"));
        const horasExtras = Number(form.get("horasExtras")) || 0;
        const cargaHorariaDiaria = Number(form.get("cargaHorariaDiaria")) || 8;
        const nascimento = form.get("nascimento");

        const data = {
            nomeCompleto: nomeCompleto,
            cpf: cpf,
            rg: rg,
            email: email,
            telefone: telefone || null,
            admissao: admissao,
            matricula: matricula,
            cdDepartamento: cdDepartamento,
            cdCargo: cdCargo,
            estadoCivil: estadoCivil,
            sexo: sexo,
            ativo: 1,
            hashSenha: "teste123", // Mock - em produção isso seria gerado ou definido pelo usuário
            dependentes: dependentes,
            cdGestor: cdGestor,
            cdEndereco: cdEndereco,
            horasExtras: horasExtras,
            cargaHorariaDiaria: cargaHorariaDiaria,
            nascimento: nascimento
        };

        // Validação de campos obrigatórios
        const requiredFields = [
            nomeCompleto, matricula, cdDepartamento, cdCargo, 
            email, admissao, cpf, rg, estadoCivil, sexo, 
            cdGestor, cdEndereco, nascimento
        ];

        if (requiredFields.some(field => !field)) {
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
            const errorMessage = err.response?.data?.message || "Erro ao salvar colaborador";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setError(null);
        resetUploadState();
    };

    const inputStyle = "border border-gray-300 rounded-lg p-3 w-full mt-1 text-gray-700 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500";
    const labelStyle = "block text-sm font-medium text-gray-700";

    const LoadingSelect = ({ text }) => (
        <div className={`${inputStyle} flex items-center justify-between text-gray-400 cursor-not-allowed bg-gray-50`}>
            {text}
            <Loader size={18} className="animate-spin" />
        </div>
    );

    // Estilos para a área de drag and drop
    const getDropZoneStyle = () => {
        const baseStyle = "p-8 border-2 border-dashed rounded-lg text-center transition-all duration-200 cursor-pointer";
        
        if (isDragging) {
            return `${baseStyle} border-indigo-500 bg-indigo-50`;
        }
        if (uploadStatus === 'error') {
            return `${baseStyle} border-red-300 bg-red-50`;
        }
        if (file) {
            return `${baseStyle} border-green-300 bg-green-50`;
        }
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

                            {/* Linha 2: CPF e RG */}
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

                            {/* Linha 3: Departamento e Cargo */}
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
                                            <option key={dep.cdDepartamento} value={dep.cdDepartamento}>{dep.nome}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

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
                                            <option key={cargo.cdCargo} value={cargo.cdCargo}>{cargo.nome}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Linha 4: E-mail e Telefone */}
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

                            {/* Linha 5: Data de Nascimento e Data de Admissão */}
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

                            {/* Linha 6: Estado Civil e Sexo */}
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

                            {/* Linha 7: Gestor e Endereço */}
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
                                        disabled={dataError}
                                    >
                                        <option value="" disabled>Selecione o gestor</option>
                                        {gestores.map(gestor => (
                                            <option key={gestor.cdFuncionario} value={gestor.cdFuncionario}>
                                                {gestor.nomeCompleto}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

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
                                        disabled={dataError}
                                    >
                                        <option value="" disabled>Selecione o endereço</option>
                                        {enderecos.map(endereco => (
                                            <option key={endereco.cdEndereco} value={endereco.cdEndereco}>
                                                {endereco.logradouro}, {endereco.numero} - {endereco.cidade}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Linha 8: Carga Horária Diária e Horas Extras */}
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

                            {/* Linha 9: Dependentes */}
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

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                        {/* Botões de Ação */}
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
                                disabled={loading || dataLoading || dataError}
                                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white transition cursor-pointer ${
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
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
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
                                            <p className="text-xs text-gray-500 mt-2">
                                                Suporte para .xlsx, .xls, .csv (máx. 10MB)
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mensagens de status */}
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

                        {/* Botão de importar */}
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

                        {/* Informações adicionais */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-medium text-blue-800 mb-2">Formato esperado do Excel:</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Colunas: Nome, CPF, RG, E-mail, Telefone, Matrícula, etc.</li>
                                <li>• A primeira linha deve conter os cabeçalhos das colunas</li>
                                <li>• Formato de datas: YYYY-MM-DD</li>
                            </ul>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}