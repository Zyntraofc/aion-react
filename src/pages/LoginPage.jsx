import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig.js";
import icons from "../assets/icons/index.jsx";
import logo from "../assets/appIcon.png";
import mockupDemonstracao from "../assets/demonstration.png";
function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuário logado:", userCredential.user);
            navigate("/home");
        } catch (error) {
            console.error("Erro ao logar:", error.message);
            // Usar um modal de erro ou toast em vez de alert()
            alert("Falha no login: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center font-sans">
            <div className="grid grid-cols-5 rounded-3xl shadow-2xl z-10 max-w-4xl w-full bg-gray-100 p-4 gap-4">

                <div className="bg-white rounded-2xl col-span-3 flex flex-col justify-center px-5 py-5">

                    <header className="mb-10 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center">
                                <img
                                    src={logo}
                                    alt="Logo Aion"
                                    className="w-full h-full"
                                />
                            </div>
                            <h1 className="text- font-semibold text-primary">aion</h1>
                        </div>

                        {/* Link Cadastre-se */}
                        <p className="text-sm text-gray-500">
                            Não tem uma conta?
                            <a
                                href="#signup"
                                className="text-primary hover:text-indigo-700 font-medium ml-1 transition"
                            >
                                Cadastre-se
                            </a>
                        </p>
                    </header>
                    <div className="pl-10 pr-10">
                        {/* TÍTULO PRINCIPAL */}
                        <h1 className="text-[100%] font-bold text-gray-900 mb-2">
                            Comece agora
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Por favor, entre com as suas credenciais
                        </p>

                        {/* FORMULÁRIO */}
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-primary mb-1"
                                > E-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu.email@exemplo.com"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-primary mb-1"
                                > Senha
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                />
                            </div>

                            {/* Link Esqueceu a senha? */}
                            <div className="text-right">
                                <a
                                    href="#forgot"
                                    className="text-sm text-indigo-500 hover:text-indigo-600 transition"
                                >
                                    Esqueceu a senha?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                // Estilo do botão ajustado para o layout
                                className={`w-full py-3 mt-4 mb-6 font-semibold rounded-2xl transition duration-200 shadow-md ${
                                    loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 text-white"
                                }`}
                            >
                                {loading ? "Entrando..." : "Entrar"}
                            </button>
                        </form>
                    </div>

                </div>


                {/* === LADO DIREITO: CONTEÚDO PROMOCIONAL (2/5) === */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-400 flex flex-col items-center  text-white pt-10 rounded-2xl col-span-2">
                    {/* Conteúdo principal */}
                    <h3 className="text-xl font-semibold leading-snug">
                        Entenda o tempo e transforme <br/>a presença das suas equipes!
                    </h3>
                    <div className=" bottom-0 left-0 w-[85%] h-[50%]">
                        <img
                            src={mockupDemonstracao}
                            alt="Mockup cortado"
                            className="w-full h-full object-cover transform "
                        />
                    </div>
                </div>
            </div>

            {/* Figura decorativa externa restaurada */}
            <div className="flex items-center justify-center absolute left-30 top-10">
                {icons.figure}
            </div>
        </div>
    );
}

export default LoginPage;
