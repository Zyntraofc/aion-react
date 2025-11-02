import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../utils/firebaseConfig.js";
import logo from "../assets/appIcon.png";
import mockupDemonstracao from "../assets/demonstration.png";
import {
    formatCNPJ,
    formatCPF,
    formatCEP,
    formatTelefone,
    validateStep,
    validateField
} from "../utils/validation.js";

function SignupPage() {
    const [step, setStep] = useState(1);
    const [razaoSocial, setRazaoSocial] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [dataAbertura, setDataAbertura] = useState("");
    const [emailInstitucional, setEmailInstitucional] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cep, setCep] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");

    // Variáveis do responsável
    const [cNomeCompleto, setCNomeCompleto] = useState("");
    const [cCPF, setCCPF] = useState("");
    const [cRG, setCRG] = useState("");
    const [dNascimento, setDNascimento] = useState("");
    const [cEstadoCivil, setCEstadoCivil] = useState("");
    const [dAdmissao, setDAdmissao] = useState("");
    const [iDependentes, setIDependentes] = useState("");
    const [cEmail, setCEmail] = useState("");
    const [cTelefone, setCTelefone] = useState("");
    const [cSexo, setCSexo] = useState("");
    const [nCargaHorariaDiaria, setNCargaHorariaDiaria] = useState("");
    const [cHoraEntrada, setCHoraEntrada] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const getFieldsForValidation = () => {
        return {
            razaoSocial,
            cnpj,
            dataAbertura,
            emailInstitucional,
            telefone,
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado,
            cNomeCompleto,
            cCPF,
            cRG,
            dNascimento,
            cEstadoCivil,
            dAdmissao,
            iDependentes,
            cEmail,
            cTelefone,
            cSexo,
            nCargaHorariaDiaria,
            cHoraEntrada,
            password,
            confirmPassword
        };
    };

    // Função para validar campo individual em tempo real
    const handleFieldBlur = (fieldName, value) => {
        const error = validateField(fieldName, value, step);
        if (error) {
            setErrors(prev => ({ ...prev, [fieldName]: error }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const handleNext = () => {
        const fields = getFieldsForValidation();
        const newErrors = validateStep(step, fields);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setStep((prev) => prev + 1);
        }
    };

    const handleBack = () => setStep((prev) => prev - 1);

    const buildJsonData = () => {
        return {
            endereco: {
                cep: cep,
                rua: rua,
                numero: parseInt(numero),
                complemento: "",
                bairro: bairro,
                cidade: cidade,
                estado: estado
            },
            empresa: {
                razaoSocial: razaoSocial,
                cnpj: cnpj,
                telefone: telefone,
                abertura: dataAbertura,
                emailInstitucional: emailInstitucional,
                ativo: "1",
                cdResponsavel: null
            },
            departamento: {
                nome: "",
                cdResponsavel: null,
                cdEmpresa: null,
                ativo: "1"
            },
            cargo: {
                nome: "",
                cargoConfianca: "1",
                ativo: "1"
            },
            responsavel: {
                nomeCompleto: cNomeCompleto,
                cpf: cCPF,
                rg: cRG,
                nascimento: dNascimento,
                estadoCivil: cEstadoCivil,
                admissao: dAdmissao,
                dependentes: parseInt(iDependentes),
                email: cEmail,
                telefone: cTelefone,
                sexo: cSexo,
                cdEndereco: null,
                cdDepartamento: 1,
                cdCargo: 1,
                cdGestor: null,
                hashSenha: "",
                ativo: "1",
                horasExtras: null,
                cargaHorariaDiaria: parseInt(nCargaHorariaDiaria),
                horaEntrada: cHoraEntrada
            }
        };
    };

    const sendDataToEndpoint = async (jsonData) => {
        try {
            const endpointUrl = "https://ms-aion-jpa.onrender.com/api/v1/empresa/inserir/responsavel";

            const username = "rh";
            const password = "rhpass";
            const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

            const response = await fetch(endpointUrl, {
                method: "POST",
                headers: {
                    'Authorization': basicAuth,
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    'Origin': 'http://localhost:5173'
                },
                mode: 'cors', // força o modo CORS
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log("✅ Dados enviados com sucesso para o endpoint:", result);
            return result;
        } catch (error) {
            console.error("Erro ao enviar dados para o endpoint:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fields = getFieldsForValidation();
        const newErrors = validateStep(4, fields);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            // 1. Cadastrar no Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, cEmail, password);
            console.log("Usuário Firebase criado:", userCredential.user.uid);

            // 2. Construir o JSON
            const jsonData = buildJsonData();
            console.log("JSON construído:", jsonData);

            // 3. Enviar para o endpoint
            await sendDataToEndpoint(jsonData);

            alert("Cadastro realizado com sucesso!");
            navigate("/home");
        } catch (error) {
            console.error("Erro no cadastro:", error.message);
            alert("Falha no cadastro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCepChange = async (e) => {
        const value = formatCEP(e.target.value);
        setCep(value);

        const numericValue = value.replace(/\D/g, "");
        if (numericValue.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${numericValue}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setRua(data.logradouro || "");
                    setBairro(data.bairro || "");
                    setCidade(data.localidade || "");
                    setEstado(data.uf || "");
                } else {
                    alert("CEP não encontrado!");
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                alert("Erro ao consultar o CEP.");
            }
        }
    };

    const variants = {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center font-sans p-4 bg-gray-100">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 rounded-3xl shadow-2xl z-10 bg-gray-100 p-4 gap-4">
                {/* Coluna do Formulário - Ocupa toda a largura em mobile, 3 colunas em desktop */}
                <div className="bg-white rounded-2xl lg:col-span-3 flex flex-col justify-center px-4 sm:px-5 py-5">
                    <header className="mb-6 sm:mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center">
                                <img src={logo} alt="Logo Aion" className="w-full h-full" />
                            </div>
                            <h1 className="text-lg font-semibold text-primary">aion</h1>
                        </div>
                        <p className="text-sm text-gray-500 text-center sm:text-left">
                            Já tem uma conta?
                            <Link
                                to="/login"
                                className="text-primary hover:text-indigo-700 font-medium ml-1 transition"
                            >
                                Entrar
                            </Link>
                        </p>
                    </header>

                    <div className="px-2 sm:px-4 md:px-10">
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        variants={variants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.35, ease: "easeInOut" }}
                                    >
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center sm:text-left">
                                            Crie sua conta e comece sua gestão
                                        </h1>
                                        <p className="text-gray-600 mb-4 text-sm sm:text-base text-center sm:text-left">
                                            Preencha os dados da sua empresa e do responsável
                                        </p>

                                        <h3 className="text-lg font-semibold text-tertiary mb-4">
                                            1. Informações Institucionais
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <label
                                                        htmlFor="razaoSocial"
                                                        className="block text-sm font-medium text-primary mb-1"
                                                    >
                                                        Razão Social
                                                    </label>
                                                    {errors.razaoSocial && <span className="text-red-500 text-sm">Obrigatório</span>}
                                                </div>
                                                <input
                                                    type="text"
                                                    id="razaoSocial"
                                                    value={razaoSocial}
                                                    onChange={(e) => setRazaoSocial(e.target.value)}
                                                    onBlur={(e) => handleFieldBlur('razaoSocial', e.target.value)}
                                                    required
                                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="flex justify-between items-center">
                                                        <label
                                                            htmlFor="cnpj"
                                                            className="block text-sm font-medium text-primary mb-1"
                                                        >
                                                            CNPJ
                                                        </label>
                                                        {errors.cnpj && <span className="text-red-500 text-sm">Obrigatório</span>}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="cnpj"
                                                        value={cnpj}
                                                        onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                                                        onBlur={(e) => handleFieldBlur('cnpj', e.target.value)}
                                                        placeholder="00.000.000/0000-00"
                                                        required
                                                        className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                    />
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center">
                                                        <label
                                                            htmlFor="dataAbertura"
                                                            className="block text-sm font-medium text-primary mb-1"
                                                        >
                                                            Data de Abertura
                                                        </label>
                                                        {errors.dataAbertura && <span className="text-red-500 text-sm">Obrigatório</span>}
                                                    </div>
                                                    <input
                                                        type="date"
                                                        id="dataAbertura"
                                                        value={dataAbertura}
                                                        onChange={(e) => setDataAbertura(e.target.value)}
                                                        onBlur={(e) => handleFieldBlur('dataAbertura', e.target.value)}
                                                        required
                                                        className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <label
                                                        htmlFor="emailInstitucional"
                                                        className="block text-sm font-medium text-primary mb-1"
                                                    >
                                                        Email Institucional
                                                    </label>
                                                    {errors.emailInstitucional && <span className="text-red-500 text-sm">Obrigatório</span>}
                                                </div>
                                                <input
                                                    type="email"
                                                    id="emailInstitucional"
                                                    value={emailInstitucional}
                                                    onChange={(e) => setEmailInstitucional(e.target.value)}
                                                    onBlur={(e) => handleFieldBlur('emailInstitucional', e.target.value)}
                                                    required
                                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <label
                                                        htmlFor="telefone"
                                                        className="block text-sm font-medium text-primary mb-1"
                                                    >
                                                        Telefone Institucional
                                                    </label>
                                                    {errors.telefone && <span className="text-red-500 text-sm">Obrigatório</span>}
                                                </div>
                                                <input
                                                    type="text"
                                                    id="telefone"
                                                    value={telefone}
                                                    onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                                                    onBlur={(e) => handleFieldBlur('telefone', e.target.value)}
                                                    placeholder="(00) 00000-0000"
                                                    required
                                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="w-full py-3 mt-6 font-semibold rounded-2xl bg-gradient-to-r from-primary to-tertiary text-white shadow-md hover:from-indigo-600 hover:to-primary transition duration-200 text-sm sm:text-base"
                                        >
                                            Continuar
                                        </button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        variants={variants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.35, ease: "easeInOut" }}
                                    >
                                        <h3 className="text-lg font-semibold text-tertiary mb-4">
                                            2. Informações de Localização
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { id: "cep", label: "CEP", value: cep, setter: setCep, format: formatCEP, placeholder: "00000-000" },
                                                { id: "rua", label: "Rua", value: rua, setter: setRua },
                                                { id: "numero", label: "Número", value: numero, setter: setNumero, type: "text" },
                                                { id: "bairro", label: "Bairro", value: bairro, setter: setBairro },
                                                { id: "estado", label: "Estado", value: estado, setter: setEstado },
                                                { id: "cidade", label: "Cidade", value: cidade, setter: setCidade },
                                            ].map((field) => (
                                                <div key={field.id} className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <label
                                                            htmlFor={field.id}
                                                            className="block text-sm font-medium text-primary mb-1"
                                                        >
                                                            {field.label}
                                                        </label>
                                                        {errors[field.id] && <span className="text-red-500 text-sm">Obrigatório</span>}
                                                    </div>
                                                    <input
                                                        type={field.type || "text"}
                                                        id={field.id}
                                                        value={field.value}
                                                        placeholder={field.placeholder}
                                                        onChange={(e) => {
                                                            const value = field.format ? field.format(e.target.value) : e.target.value;
                                                            field.setter(value);
                                                            if (field.id === "cep") handleCepChange(e);
                                                        }}
                                                        onBlur={(e) => handleFieldBlur(field.id, e.target.value)}
                                                        required
                                                        className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="w-full py-3 text-gray-700 bg-gray-200 font-semibold rounded-2xl shadow-md hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                className="w-full py-3 font-semibold rounded-2xl bg-gradient-to-r from-primary to-tertiary text-white shadow-md hover:from-indigo-600 hover:to-primary transition duration-200 text-sm sm:text-base"
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        variants={variants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.35, ease: "easeInOut" }}
                                    >
                                        <h3 className="text-lg font-semibold text-tertiary mb-4">
                                            3. Informações do Responsável
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { id: "cNomeCompleto", label: "Nome Completo", value: cNomeCompleto, setter: setCNomeCompleto, full: true },
                                                { id: "cCPF", label: "CPF", value: cCPF, setter: setCCPF, format: formatCPF, placeholder: "000.000.000-00" },
                                                { id: "cRG", label: "RG", value: cRG, setter: setCRG },
                                                { id: "dNascimento", label: "Data de Nascimento", value: dNascimento, setter: setDNascimento, type: "date" },
                                                { id: "cEstadoCivil", label: "Estado Civil", value: cEstadoCivil, setter: setCEstadoCivil, type: "select", options: ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"] },
                                                { id: "dAdmissao", label: "Data de Admissão", value: dAdmissao, setter: setDAdmissao, type: "date" },
                                                { id: "iDependentes", label: "Dependentes", value: iDependentes, setter: setIDependentes, type: "number" },
                                                { id: "cTelefone", label: "Telefone", value: cTelefone, setter: setCTelefone, format: formatTelefone, placeholder: "(00) 00000-0000" },
                                                { id: "cSexo", label: "Sexo", value: cSexo, setter: setCSexo, type: "select", options: ["Masculino", "Feminino", "Outro"] },
                                                { id: "nCargaHorariaDiaria", label: "Carga Horária Diária (h)", value: nCargaHorariaDiaria, setter: setNCargaHorariaDiaria, type: "number" },
                                                { id: "cHoraEntrada", label: "Hora de Entrada", value: cHoraEntrada, setter: setCHoraEntrada, type: "time" },
                                            ].map((field) => (
                                                <div
                                                    key={field.id}
                                                    className={`${field.full ? "col-span-1 sm:col-span-2" : "flex-1"}`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <label
                                                            htmlFor={field.id}
                                                            className="block text-sm font-medium text-primary mb-1"
                                                        >
                                                            {field.label}
                                                        </label>
                                                        {errors[field.id] && <span className="text-red-500 text-sm">Obrigatório</span>}
                                                    </div>

                                                    {field.type === "select" ? (
                                                        <select
                                                            id={field.id}
                                                            value={field.value}
                                                            onChange={(e) => field.setter(e.target.value)}
                                                            onBlur={(e) => handleFieldBlur(field.id, e.target.value)}
                                                            required
                                                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                        >
                                                            <option value="">Selecione...</option>
                                                            {field.options.map((opt) => (
                                                                <option key={opt} value={opt}>
                                                                    {opt}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type={field.type || "text"}
                                                            id={field.id}
                                                            value={field.value}
                                                            placeholder={field.placeholder}
                                                            onChange={(e) => {
                                                                const value = field.format ? field.format(e.target.value) : e.target.value;
                                                                field.setter(value);
                                                            }}
                                                            onBlur={(e) => handleFieldBlur(field.id, e.target.value)}
                                                            required
                                                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="w-full py-3 text-gray-700 bg-gray-200 font-semibold rounded-2xl shadow-md hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                className="w-full py-3 font-semibold rounded-2xl bg-gradient-to-r from-primary to-tertiary text-white shadow-md hover:from-indigo-600 hover:to-primary transition duration-200 text-sm sm:text-base"
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        variants={variants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.35, ease: "easeInOut" }}
                                    >
                                        <h3 className="text-lg font-semibold text-tertiary mb-4">
                                            4. Informações de Credenciais
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium text-primary mb-1"
                                                    >
                                                        Email
                                                    </label>
                                                    {errors.cEmail && <span className="text-red-500 text-sm">Obrigatório</span>}
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={cEmail}
                                                    onChange={(e) => setCEmail(e.target.value)}
                                                    onBlur={(e) => handleFieldBlur('cEmail', e.target.value)}
                                                    required
                                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <label
                                                        htmlFor="password"
                                                        className="block text-sm font-medium text-primary mb-1"
                                                    >
                                                        Senha
                                                    </label>
                                                    {errors.password && <span className="text-red-500 text-sm">Obrigatório</span>}
                                                </div>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onBlur={(e) => handleFieldBlur('password', e.target.value)}
                                                    required
                                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <label
                                                        htmlFor="confirmPassword"
                                                        className="block text-sm font-medium text-primary mb-1"
                                                    >
                                                        Confirmar Senha
                                                    </label>
                                                    {errors.confirmPassword && <span className="text-red-500 text-sm">Obrigatório</span>}
                                                </div>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    onBlur={(e) => handleFieldBlur('confirmPassword', e.target.value)}
                                                    required
                                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary transition text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="w-full py-3 text-gray-700 bg-gray-200 font-semibold rounded-2xl shadow-md hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`w-full py-3 font-semibold rounded-2xl shadow-md transition duration-200 text-sm sm:text-base ${
                                                    loading
                                                        ? "bg-gray-400 cursor-not-allowed text-gray-600"
                                                        : "bg-gradient-to-r from-primary to-tertiary text-white hover:from-indigo-600 hover:to-primary"
                                                }`}
                                            >
                                                {loading ? "Salvando..." : "Finalizar Cadastro"}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>

                {/* Coluna da Imagem - Oculta em mobile, aparece em desktop */}
                <div className="hidden lg:flex bg-gradient-to-br from-primary to-tertiary text-white rounded-2xl lg:col-span-2">
                    <div className="pt-20 h-full flex flex-col items-center justify-between w-full">
                        <h3 className="text-xl font-semibold leading-snug text-center px-4">
                            Entenda o tempo e transforme <br />a presença das suas equipes!
                        </h3>
                        <div className="w-full h-[80%] mt-4">
                            <img
                                src={mockupDemonstracao}
                                alt="Mockup demonstrativo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;