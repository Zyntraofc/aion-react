import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Phone, MapPin, Calendar, IdCard, Building, Briefcase, Users, Clock, Cake } from "lucide-react";
import axios from "axios";

// URLs da API
const API_DEPARTAMENTOS = "https://ms-aion-jpa.onrender.com/api/v1/departamento/listar";
const API_CARGOS = "https://ms-aion-jpa.onrender.com/api/v1/cargo/listar";
const API_GESTORES = "https://ms-aion-jpa.onrender.com/api/v1/funcionario/listar";
const API_ENDERECOS = "https://ms-aion-jpa.onrender.com/api/v1/endereco/listar";

export default function ViewEmployeeModal({ open, onClose, employee }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);

    // Estados para dados relacionados
    const [departamentos, setDepartamentos] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [gestores, setGestores] = useState([]);
    const [enderecos, setEnderecos] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    // Mapeamentos para campos numéricos
    const estadoCivilMap = {
        1: "Solteiro(a)",
        2: "Casado(a)",
        3: "Divorciado(a)",
        4: "Viúvo(a)",
        5: "União Estável"
    };

    const sexoMap = {
        1: "Masculino",
        2: "Feminino",
        3: "Outro"
    };

    const statusMap = {
        true: "Ativo",
        false: "Inativo",
        1: "Ativo",
        0: "Inativo"
    };

    // Buscar dados relacionados quando o modal abrir
    useEffect(() => {
        if (open) {
            fetchRelatedData();
        }
    }, [open]);

    // Atualizar employeeData quando employee mudar
    useEffect(() => {
        if (employee) {
            setEmployeeData(employee);
        }
    }, [employee]);

    const fetchRelatedData = async () => {
        setDataLoading(true);
        setError(null);

        try {
            // Buscar dados relacionados
            const [deptResponse, cargoResponse, gestoresResponse, enderecosResponse] = await Promise.all([
                axios.get(API_DEPARTAMENTOS),
                axios.get(API_CARGOS),
                axios.get(API_GESTORES),
                axios.get(API_ENDERECOS)
            ]);

            setDepartamentos(deptResponse.data);
            setCargos(cargoResponse.data);
            setGestores(gestoresResponse.data);
            setEnderecos(enderecosResponse.data);

        } catch (err) {
            console.error("❌ Erro ao carregar dados relacionados:", err);
            setError("Não foi possível carregar alguns dados.");
        } finally {
            setDataLoading(false);
        }
    };

    // Funções auxiliares para buscar nomes dos relacionamentos
    const getDepartamentoNome = (cdDepartamento) => {
        if (!cdDepartamento) return "Não definido";
        const dept = departamentos.find(d => d.cdDepartamento === cdDepartamento);
        return dept ? dept.nmDepartamento || dept.nome : "Não encontrado";
    };

    const getCargoNome = (cdCargo) => {
        if (!cdCargo) return "Não definido";
        const cargo = cargos.find(c => c.cdCargo === cdCargo);
        return cargo ? cargo.nmCargo || cargo.nome : "Não encontrado";
    };

    const getGestorNome = (cdGestor) => {
        if (!cdGestor) return "Não definido";
        const gestor = gestores.find(g => g.cdFuncionario === cdGestor);
        return gestor ? gestor.nmFuncionario || gestor.nomeCompleto : "Não definido";
    };

    const getEnderecoCompleto = (cdEndereco) => {
        if (!cdEndereco) return "Não informado";
        const endereco = enderecos.find(e => e.cdEndereco === cdEndereco);
        if (!endereco) return "Não encontrado";

        return `${endereco.logradouro}, ${endereco.numero} - ${endereco.cidade}, ${endereco.estado}`;
    };

    // Formatar datas
    const formatarData = (dataString) => {
        if (!dataString) return "Não informada";
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    const calcularIdade = (dataNascimento) => {
        if (!dataNascimento) return null;
        const nascimento = new Date(dataNascimento);
        const hoje = new Date();
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    };

    const calcularTempoCasa = (dataAdmissao) => {
        if (!dataAdmissao) return null;
        const admissao = new Date(dataAdmissao);
        const hoje = new Date();
        const diffTime = Math.abs(hoje - admissao);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Converter para anos, meses e dias
        const anos = Math.floor(diffDays / 365);
        const meses = Math.floor((diffDays % 365) / 30);
        const dias = diffDays % 30;

        if (anos > 0) {
            return `${anos} ano${anos > 1 ? 's' : ''} e ${meses} mes${meses > 1 ? 'es' : ''}`;
        } else if (meses > 0) {
            return `${meses} mes${meses > 1 ? 'es' : ''} e ${dias} dia${dias > 1 ? 's' : ''}`;
        } else {
            return `${dias} dia${dias > 1 ? 's' : ''}`;
        }
    };

    if (!open) return null;

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

                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <User size={24} className="text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                        Visualizar Colaborador
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {dataLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <span className="ml-2 text-gray-600">Carregando dados...</span>
                    </div>
                )}

                {employeeData && (
                    <div className="space-y-6">
                        {/* Cabeçalho com informações principais */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {employeeData.nmFuncionario || employeeData.nomeCompleto || "Nome não informado"}
                                    </h1>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            employeeData.ativo === true || employeeData.ativo === 1
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-red-100 text-red-800 border-red-200'
                                        } border`}>
                                            {statusMap[employeeData.ativo] || 'Desconhecido'}
                                        </span>
                                        <span className="text-gray-600">{employeeData.matricula || employeeData.cdMatricula}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900">
                                        {getCargoNome(employeeData.cdCargo)}
                                    </p>
                                    <p className="text-gray-600">{getDepartamentoNome(employeeData.cdDepartamento)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Coluna 1: Informações Pessoais */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <User size={20} className="text-indigo-600" />
                                    Informações Pessoais
                                </h3>

                                <div className="space-y-3">
                                    <InfoItem
                                        icon={<IdCard size={16} />}
                                        label="CPF"
                                        value={employeeData.cpf || "Não informado"}
                                    />
                                    <InfoItem
                                        icon={<IdCard size={16} />}
                                        label="RG"
                                        value={employeeData.rg || "Não informado"}
                                    />
                                    <InfoItem
                                        icon={<Cake size={16} />}
                                        label="Data de Nascimento"
                                        value={employeeData.nascimento ?
                                            `${formatarData(employeeData.nascimento)} (${calcularIdade(employeeData.nascimento)} anos)`
                                            : "Não informada"
                                        }
                                    />
                                    <InfoItem
                                        icon={<Users size={16} />}
                                        label="Estado Civil"
                                        value={estadoCivilMap[employeeData.estadoCivil] || "Não informado"}
                                    />
                                    <InfoItem
                                        icon={<User size={16} />}
                                        label="Sexo"
                                        value={sexoMap[employeeData.sexo] || "Não informado"}
                                    />
                                    <InfoItem
                                        icon={<Users size={16} />}
                                        label="Dependentes"
                                        value={employeeData.dependentes || 0}
                                    />
                                </div>
                            </div>

                            {/* Coluna 2: Informações Profissionais */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Briefcase size={20} className="text-indigo-600" />
                                    Informações Profissionais
                                </h3>

                                <div className="space-y-3">
                                    <InfoItem
                                        icon={<Building size={16} />}
                                        label="Departamento"
                                        value={getDepartamentoNome(employeeData.cdDepartamento)}
                                    />
                                    <InfoItem
                                        icon={<Briefcase size={16} />}
                                        label="Cargo"
                                        value={getCargoNome(employeeData.cdCargo)}
                                    />
                                    <InfoItem
                                        icon={<Calendar size={16} />}
                                        label="Data de Admissão"
                                        value={employeeData.admissao ?
                                            `${formatarData(employeeData.admissao)} (${calcularTempoCasa(employeeData.admissao)})`
                                            : "Não informada"
                                        }
                                    />
                                    <InfoItem
                                        icon={<Users size={16} />}
                                        label="Gestor"
                                        value={getGestorNome(employeeData.cdGestor)}
                                    />
                                    <InfoItem
                                        icon={<Clock size={16} />}
                                        label="Carga Horária Diária"
                                        value={`${employeeData.cargaHorariaDiaria || 8} horas`}
                                    />
                                    <InfoItem
                                        icon={<Clock size={16} />}
                                        label="Horas Extras"
                                        value={employeeData.horasExtras || 0}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Informações de Contato */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Mail size={20} className="text-indigo-600" />
                                Informações de Contato
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem
                                    icon={<Mail size={16} />}
                                    label="E-mail"
                                    value={employeeData.email || "Não informado"}
                                />
                                <InfoItem
                                    icon={<Phone size={16} />}
                                    label="Telefone"
                                    value={employeeData.telefone || "Não informado"}
                                />
                                <div className="md:col-span-2">
                                    <InfoItem
                                        icon={<MapPin size={16} />}
                                        label="Endereço"
                                        value={getEnderecoCompleto(employeeData.cdEndereco)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botão de Fechar */}
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}

                {!employeeData && !dataLoading && (
                    <div className="text-center py-8 text-gray-500">
                        Nenhum dado do colaborador disponível.
                    </div>
                )}
            </motion.div>
        </div>
    );
}

// Componente auxiliar para exibir informações
function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-indigo-600 mt-0.5">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <p className="text-gray-900 mt-1">{value}</p>
            </div>
        </div>
    );
}