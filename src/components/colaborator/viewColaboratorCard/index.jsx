import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, MapPin, Calendar, IdCard, Building, Briefcase, Users, Clock, Cake, Edit, Save, Loader, CheckCircle } from "lucide-react";

export default function ViewEmployeeModal({
                                              open,
                                              onClose,
                                              employee,
                                              onSuccess,
                                              mode = "view" // "view" ou "edit"
                                          }) {
    const [isEditing, setIsEditing] = useState(mode === "edit");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Estados para dados relacionados (mockados)
    const [departamentos, setDepartamentos] = useState([
        { cdDepartamento: 1, nmDepartamento: "TI" },
        { cdDepartamento: 2, nmDepartamento: "RH" },
        { cdDepartamento: 3, nmDepartamento: "Financeiro" },
        { cdDepartamento: 4, nmDepartamento: "Marketing" }
    ]);

    const [cargos, setCargos] = useState([
        { cdCargo: 1, nmCargo: "Desenvolvedor" },
        { cdCargo: 2, nmCargo: "Analista" },
        { cdCargo: 3, nmCargo: "Gerente" },
        { cdCargo: 4, nmCargo: "Estagiário" }
    ]);

    const [gestores, setGestores] = useState([
        { cdFuncionario: 1, nomeCompleto: "João Silva" },
        { cdFuncionario: 2, nomeCompleto: "Maria Santos" },
        { cdFuncionario: 3, nomeCompleto: "Pedro Oliveira" }
    ]);

    const [enderecos, setEnderecos] = useState([
        { cdEndereco: 1, logradouro: "Rua das Flores", numero: "123", cidade: "São Paulo", estado: "SP" },
        { cdEndereco: 2, logradouro: "Avenida Brasil", numero: "456", cidade: "Rio de Janeiro", estado: "RJ" },
        { cdEndereco: 3, logradouro: "Rua das Palmeiras", numero: "789", cidade: "Belo Horizonte", estado: "MG" }
    ]);

    const [dataLoading, setDataLoading] = useState(false);

    // Mapeamentos
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

    // Resetar estado quando o modal abrir com novo employee
    useEffect(() => {
        if (open && employee) {
            console.log("Modal abrindo com employee:", employee);
            setEmployeeData(employee);
            setIsEditing(mode === "edit");
            setError(null);
            setShowSuccess(false);
        }
    }, [open, employee, mode]);

    // Funções auxiliares
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
        return gestor ? gestor.nomeCompleto || gestor.nmFuncionario : "Não definido";
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
        return new Date(dataString).toLocaleDateString('pt-BR');
    };

    const formatarDataParaInput = (dataString) => {
        if (!dataString) return "";
        return new Date(dataString).toISOString().split('T')[0];
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

        const anos = Math.floor(diffDays / 365);
        const meses = Math.floor((diffDays % 365) / 30);

        if (anos > 0) {
            return `${anos} ano${anos > 1 ? 's' : ''} e ${meses} mes${meses > 1 ? 'es' : ''}`;
        } else {
            return `${meses} mes${meses > 1 ? 'es' : ''}`;
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setEmployeeData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSelectChange = (name, value) => {
        setEmployeeData(prev => ({
            ...prev,
            [name]: value ? Number(value) : null
        }));
    };

    const handleSave = async () => {
        if (!employeeData) return;

        setLoading(true);
        setError(null);
        setShowSuccess(false);

        try {
            console.log("💾 Simulando salvamento de dados:", employeeData);

            // Simular um tempo de processamento (2-3 segundos)
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

            // Simular sucesso (sem chamada de API real)
            console.log("✅ Dados salvos com sucesso (simulação)");

            // Mostrar mensagem de sucesso
            setShowSuccess(true);

            // Manter a mensagem por 3 segundos antes de fechar
            setTimeout(() => {
                setShowSuccess(false);
                setIsEditing(false);
                onSuccess?.();
            }, 3000);

        } catch (err) {
            console.error("❌ Erro simulado ao salvar:", err);
            setError("Erro simulado ao salvar os dados");
        } finally {
            setLoading(false);
        }
    };

    if (!open || !employee) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <User size={24} className="text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            {isEditing ? "Editar Colaborador" : "Visualizar Colaborador"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isEditing && !showSuccess && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Edit size={16} />
                                Editar
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            disabled={loading}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Mensagem de Sucesso */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                        >
                            <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                            <div>
                                <p className="text-green-800 font-medium">Alterações salvas com sucesso!</p>
                                <p className="text-green-600 text-sm">As informações do colaborador foram atualizadas.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content */}
                <div className="p-6">
                    {employeeData && (
                        <div className="space-y-6">
                            {/* Cabeçalho */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {employeeData.nomeCompleto || "Nome não informado"}
                                        </h1>
                                        <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          employeeData.ativo === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {employeeData.ativo === 1 ? 'Ativo' : 'Inativo'}
                      </span>
                                            <span className="text-gray-600">Matrícula: {employeeData.cdMatricula || employeeData.matricula}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Loading Overlay durante o salvamento */}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="fixed inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl"
                                >
                                    <div className="text-center">
                                        <Loader size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
                                        <p className="text-gray-700 font-medium">Salvando alterações...</p>
                                        <p className="text-gray-500 text-sm mt-1">Aguarde enquanto processamos suas alterações</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Grid de informações */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Informações Pessoais */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <User size={20} className="text-indigo-600" />
                                        Informações Pessoais
                                    </h3>

                                    <div className="space-y-3">
                                        <InfoItem icon={<IdCard size={16} />} label="CPF"
                                                  value={isEditing ? (
                                                      <input
                                                          name="cpf"
                                                          value={employeeData.cpf || ""}
                                                          onChange={handleInputChange}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      />
                                                  ) : employeeData.cpf || "Não informado"} />

                                        <InfoItem icon={<IdCard size={16} />} label="RG"
                                                  value={isEditing ? (
                                                      <input
                                                          name="rg"
                                                          value={employeeData.rg || ""}
                                                          onChange={handleInputChange}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      />
                                                  ) : employeeData.rg || "Não informado"} />

                                        <InfoItem icon={<Cake size={16} />} label="Data de Nascimento"
                                                  value={isEditing ? (
                                                      <input
                                                          type="date"
                                                          name="nascimento"
                                                          value={formatarDataParaInput(employeeData.nascimento)}
                                                          onChange={handleInputChange}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      />
                                                  ) : employeeData.nascimento ?
                                                      `${formatarData(employeeData.nascimento)} (${calcularIdade(employeeData.nascimento)} anos)`
                                                      : "Não informada"} />

                                        <InfoItem icon={<Users size={16} />} label="Estado Civil"
                                                  value={isEditing ? (
                                                      <select
                                                          name="estadoCivil"
                                                          value={employeeData.estadoCivil || ""}
                                                          onChange={(e) => handleSelectChange('estadoCivil', e.target.value)}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      >
                                                          <option value="">Selecione</option>
                                                          <option value="1">Solteiro(a)</option>
                                                          <option value="2">Casado(a)</option>
                                                          <option value="3">Divorciado(a)</option>
                                                          <option value="4">Viúvo(a)</option>
                                                          <option value="5">União Estável</option>
                                                      </select>
                                                  ) : estadoCivilMap[employeeData.estadoCivil] || "Não informado"} />

                                        <InfoItem icon={<User size={16} />} label="Sexo"
                                                  value={isEditing ? (
                                                      <select
                                                          name="sexo"
                                                          value={employeeData.sexo || ""}
                                                          onChange={(e) => handleSelectChange('sexo', e.target.value)}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      >
                                                          <option value="">Selecione</option>
                                                          <option value="1">Masculino</option>
                                                          <option value="2">Feminino</option>
                                                          <option value="3">Outro</option>
                                                      </select>
                                                  ) : sexoMap[employeeData.sexo] || "Não informado"} />
                                    </div>
                                </div>

                                {/* Informações Profissionais */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Briefcase size={20} className="text-indigo-600" />
                                        Informações Profissionais
                                    </h3>

                                    <div className="space-y-3">
                                        <InfoItem icon={<Calendar size={16} />} label="Data de Admissão"
                                                  value={isEditing ? (
                                                      <input
                                                          type="date"
                                                          name="admissao"
                                                          value={formatarDataParaInput(employeeData.admissao)}
                                                          onChange={handleInputChange}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      />
                                                  ) : employeeData.admissao ?
                                                      `${formatarData(employeeData.admissao)} (${calcularTempoCasa(employeeData.admissao)})`
                                                      : "Não informada"} />

                                        <InfoItem icon={<Users size={16} />} label="Gestor"
                                                  value={isEditing ? (
                                                      <select
                                                          value={employeeData.cdGestor || ""}
                                                          onChange={(e) => handleSelectChange('cdGestor', e.target.value)}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      >
                                                          <option value="">Selecione o gestor</option>
                                                          {gestores.map(gestor => (
                                                              <option key={gestor.cdFuncionario} value={gestor.cdFuncionario}>
                                                                  {gestor.nomeCompleto || gestor.nmFuncionario}
                                                              </option>
                                                          ))}
                                                      </select>
                                                  ) : getGestorNome(employeeData.cdGestor)} />

                                        <InfoItem icon={<Clock size={16} />} label="Carga Horária Diária"
                                                  value={isEditing ? (
                                                      <input
                                                          type="number"
                                                          name="cargaHorariaDiaria"
                                                          value={employeeData.cargaHorariaDiaria || 8}
                                                          onChange={handleInputChange}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      />
                                                  ) : `${employeeData.cargaHorariaDiaria || 8} horas`} />

                                        <InfoItem icon={<Clock size={16} />} label="Horas Extras"
                                                  value={isEditing ? (
                                                      <input
                                                          type="number"
                                                          name="horasExtras"
                                                          value={employeeData.horasExtras || 0}
                                                          onChange={handleInputChange}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      />
                                                  ) : employeeData.horasExtras || 0} />
                                        <InfoItem icon={<Users size={16} />} label="Dependentes"
                                                  value={isEditing ? (
                                                      <input
                                                          type="number"
                                                          name="dependentes"
                                                          value={employeeData.dependentes || 0}
                                                          onChange={handleInputChange}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      />
                                                  ) : employeeData.dependentes || 0} />
                                    </div>
                                </div>
                            </div>

                            {/* Informações de Contato */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Mail size={20} className="text-indigo-600" />
                                    Informações de Contato
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem icon={<Mail size={16} />} label="E-mail"
                                              value={isEditing ? (
                                                  <input
                                                      type="email"
                                                      name="email"
                                                      value={employeeData.email || ""}
                                                      onChange={handleInputChange}
                                                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                      disabled={loading}
                                                  />
                                              ) : employeeData.email || "Não informado"} />

                                    <InfoItem icon={<Phone size={16} />} label="Telefone"
                                              value={isEditing ? (
                                                  <input
                                                      name="telefone"
                                                      value={employeeData.telefone || ""}
                                                      onChange={handleInputChange}
                                                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                      disabled={loading}
                                                  />
                                              ) : employeeData.telefone || "Não informado"} />

                                    <div className="md:col-span-2">
                                        <InfoItem icon={<MapPin size={16} />} label="Endereço"
                                                  value={isEditing ? (
                                                      <select
                                                          value={employeeData.cdEndereco || ""}
                                                          onChange={(e) => handleSelectChange('cdEndereco', e.target.value)}
                                                          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                          disabled={loading}
                                                      >
                                                          <option value="">Selecione o endereço</option>
                                                          {enderecos.map(endereco => (
                                                              <option key={endereco.cdEndereco} value={endereco.cdEndereco}>
                                                                  {endereco.logradouro}, {endereco.numero} - {endereco.cidade}, {endereco.estado}
                                                              </option>
                                                          ))}
                                                      </select>
                                                  ) : getEnderecoCompleto(employeeData.cdEndereco)} />
                                    </div>
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="flex justify-end gap-3 pt-6">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            disabled={loading}
                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader size={20} className="animate-spin" />
                                                    Salvando...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={20} />
                                                    Salvar Alterações
                                                </>
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Fechar
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// Componente auxiliar
function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-indigo-600 mt-0.5">{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <div className="text-gray-900 mt-1">{value}</div>
            </div>
        </div>
    );
}