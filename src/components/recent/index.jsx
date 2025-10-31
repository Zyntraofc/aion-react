import React, { useEffect, useState } from "react";
import { HistoryIcon } from "lucide-react";
import { getAuth } from "firebase/auth";

// Utilitário para estilização de status
const getStatusClass = (status) => {
    switch (status) {
        case "Aprovada":
            return "bg-green-100 text-green-800 border border-green-200";
        case "Rejeitada":
            return "bg-red-100 text-red-800 border border-red-200";
        case "Pendente":
        default:
            return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
};

// Função para formatar hora
const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
};

const AtividadeRecente = ({ limite = 3 }) => {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    // Obter email do usuário autenticado
    const getLoggedEmail = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user?.email) return Promise.resolve(user.email);

        return new Promise((resolve) => {
            const unsub = auth.onAuthStateChanged((u) => {
                unsub();
                resolve(u?.email ?? null);
            });
        });
    };

    // Buscar atividades recentes da API
    const buscarAtividadesRecentes = async () => {
        try {
            setCarregando(true);
            setErro(null);

            const email = await getLoggedEmail();
            if (!email) throw new Error("Usuário não autenticado");

            // Buscar dados do funcionário
            const resFunc = await fetch(`/api/v1/funcionario/buscar/email/${encodeURIComponent(email)}`);
            if (!resFunc.ok) throw new Error("Erro ao buscar dados do funcionário");

            const funcionario = await resFunc.json();
            if (!funcionario?.cdMatricula) throw new Error("Matrícula não encontrada");

            // Buscar atividades recentes no Redis
            const resAtividades = await fetch(`https://ms-aion-redis.onrender.com/recent/${funcionario.cdMatricula}`);
            if (!resAtividades.ok) throw new Error("Erro ao buscar atividades recentes");

            const dados = await resAtividades.json();

            // Ordenar e limitar
            const atividadesOrdenadas = dados
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, limite);

            setSolicitacoes(atividadesOrdenadas);
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
            setErro(error.message || "Erro desconhecido");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarAtividadesRecentes();
    }, [limite]);

    // Tela de carregamento
    if (carregando) {
        return (
            <div className="w-full p-6 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                    <HistoryIcon className="w-5 h-5" />
                    <h2 className="font-semibold">Atividade Recente</h2>
                </div>
                {[...Array(limite)].map((_, i) => (
                    <div key={i} className="p-4 mb-3 rounded-xl bg-gray-100 animate-pulse flex justify-between items-center">
                        <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Tela de erro
    if (erro) {
        return (
            <div className="p-6 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                    <HistoryIcon className="w-5 h-5" />
                    <h2 className="font-semibold">Atividade Recente</h2>
                </div>
                <p className="text-center text-red-500 py-4">{erro}</p>
            </div>
        );
    }

    // Tela principal
    return (
        <div className="w-full p-6 rounded-2xl bg-white shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
                <HistoryIcon className="w-5 h-5" />
                <h2 className="font-semibold">Atividade Recente</h2>
            </div>

            {solicitacoes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhuma atividade recente</p>
            ) : (
                solicitacoes.map((item) => (
                    <div
                        key={item.timestamp}
                        className="p-4 mb-3 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center"
                    >
                        <div className="flex-1 min-w-0 mr-2">
                            <p className="font-semibold text-gray-900 truncate">{item.nome}</p>
                            <p className="text-sm text-gray-500 truncate">
                                {item.tipo} • {formatTime(item.timestamp)}
                            </p>
                        </div>

                        <span className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(item.status)}`}>
                            {item.status}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};

export default AtividadeRecente;
