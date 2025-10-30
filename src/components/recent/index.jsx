import { HistoryIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const AtividadeRecente = ({ limite = 3 }) => {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    // Função para obter o email logado
    const getLoggedEmail = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user && user.email) return Promise.resolve(user.email);

        return new Promise((resolve) => {
            const unsub = auth.onAuthStateChanged((u) => {
                unsub();
                resolve(u?.email ?? null);
            });
        });
    };

    // Função para buscar dados da API
    const buscarAtividadesRecentes = async () => {
        try {
            setCarregando(true);
            setErro(null);

            // 1. Buscar email do usuário logado
            const email = await getLoggedEmail();
            if (!email) {
                setErro("Usuário não autenticado");
                return;
            }

            // 2. Buscar dados do funcionário
            const apiFuncionario = `/api/v1/funcionario/buscar/email/${encodeURIComponent(email)}`;
            const resFunc = await fetch(apiFuncionario);

            if (!resFunc.ok) {
                throw new Error('Erro ao buscar dados do funcionário');
            }

            const funcionario = await resFunc.json();

            if (!funcionario?.cdMatricula) {
                throw new Error('Matrícula não encontrada');
            }

            // 3. Buscar atividades recentes
            const apiAtividades = `https://ms-aion-redis.onrender.com/recent/${funcionario.cdMatricula}`;
            const resAtividades = await fetch(apiAtividades);

            if (!resAtividades.ok) {
                throw new Error('Erro ao buscar atividades recentes');
            }

            const dados = await resAtividades.json();

            // Ordena por timestamp mais recente primeiro
            const atividadesOrdenadas = dados
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, limite);

            setSolicitacoes(atividadesOrdenadas);

        } catch (error) {
            console.error('Erro ao buscar atividades:', error);
            setErro(error.message || 'Erro desconhecido');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarAtividadesRecentes();
    }, [limite]);

    // Função para determinar a classe CSS baseada no status
    const getStatusClass = (status) => {
        switch (status) {
            case "Aprovada":
                return "bg-green-100 text-green-800 border border-green-200";
            case "Pendente":
                return "bg-yellow-100 text-yellow-800 border border-yellow-200";
            case "Rejeitada":
                return "bg-red-100 text-red-800 border border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    };

    if (carregando) {
        return (
            <div className="p-6 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center space-x-2">
                    <HistoryIcon className="w-5 h-5" />
                    <h2 className="font-semibold mb-3">Atividade Recente</h2>
                </div>
                {[...Array(limite)].map((_, index) => (
                    <div
                        key={index}
                        className="p-4.5 mb-4 rounded-xl bg-secondary-100 animate-pulse"
                    >
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (erro) {
        return (
            <div className="p-6 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center space-x-2">
                    <HistoryIcon className="w-5 h-5" />
                    <h2 className="font-semibold mb-3">Atividade Recente</h2>
                </div>
                <div className="text-center py-4 text-red-500">
                    Erro ao carregar atividades: {erro}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-2xl bg-white shadow-sm">
            <div className="flex items-center space-x-2">
                <HistoryIcon className="w-5 h-5" />
                <h2 className="font-semibold mb-3">Atividade Recente</h2>
            </div>

            {solicitacoes.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                    Nenhuma atividade recente
                </div>
            ) : (
                solicitacoes.map((item) => (
                    <div
                        key={item.timestamp} // Usando timestamp como chave única
                        className="p-4 mb-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex">
                                <div>
                                    <p className="font-semibold text-gray-900">{item.nome}</p>
                                </div>
                                <p className="pl-3 text-xs text-gray-400">
                                    {item.tempo}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(item.status)}`}
                            >
                {item.status}
              </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                            {item.tipo} • {item.descricao}
                        </p>

                    </div>
                ))
            )}
        </div>
    );
};

export default AtividadeRecente;