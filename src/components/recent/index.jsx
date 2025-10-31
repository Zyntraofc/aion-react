import { HistoryIcon } from "lucide-react";
import React from "react";

// Função utilitária para obter classes de estilo do status (mantida)
const getStatusClasses = (status) => {
    switch (status) {
        case "Aprovada":
            // Mapeando para as classes originais, se possível, ou mantendo a estrutura.
            // Assumindo 'text-success' é uma classe customizada que se resolve para verde.
            return "border border-green-200 text-success bg-green-100";
        case "Rejeitada":
            // Assumindo 'bg-danger' e 'text-white' são as classes originais para este status.
            return "bg-danger text-white border border-red-200";
        case "Pendente":
        default:
            // Usando um estilo padrão para 'Pendente' que se assemelhe ao original.
            return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
};

const AtividadeRecente = ({
    dados = [],
    limite = 3,
    carregando = false
}) => {
    // Ordena por data e limita a quantidade de itens (mantido)
    const solicitacoes = dados
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, limite);

    // Formatação de data/hora
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Card de Skeleton Loading (Apenas ajustes leves de layout responsivo)
    if (carregando) {
        return (
            // w-full garante que ele se expanda em telas menores
            <div className="w-full p-6 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center space-x-2">
                    <h2 className="font-semibold mb-3">Atividade Recente</h2>
                </div>
                {[...Array(limite)].map((_, index) => (
                    <div
                        key={index}
                        // Ajuste: flex e justificação para alinhar a animação
                        className="p-4 mb-4 rounded-xl bg-secondary-100 animate-pulse flex justify-between items-center"
                    >
                        <div>
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        {/* Skeleton para a tag de status */}
                        <div className="h-6 bg-gray-300 rounded-full w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Componente Renderizado
    return (
        // w-full para preencher o container pai em qualquer tela
        <div className="w-full p-6 rounded-2xl bg-white shadow-sm">
            <div className="flex items-center space-x-2">
                <h2 className="font-semibold mb-3">Atividade Recente</h2>
            </div>

            {solicitacoes.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                    Nenhuma atividade recente
                </div>
            ) : (
                solicitacoes.map((item) => (
                    <div
                        key={item.id}
                        // Mantido o layout original
                        className="p-4 mb-4 rounded-xl bg-secondary-100 flex justify-between items-center"
                    >
                        {/* ⬅️ Foco na Responsividade: Garante que o texto não quebre o layout */}
                        <div className="flex-1 min-w-0 mr-2">
                            {/* flex-1: Ocupa o espaço restante. min-w-0: Permite que o texto seja cortado/quebrado. */}
                            <p className="font-semibold truncate">{item.usuario}</p> {/* truncate: Corta o texto longo com '...' */}
                            <p className="text-sm text-gray-500">
                                <span className="truncate inline-block max-w-full">{item.motivo}</span> {/* garante que o motivo também seja tratado */}
                                • {formatTime(item.data)}
                            </p>
                        </div>

                        {/* ⬅️ Foco na Responsividade: Garante que o status mantenha seu tamanho */}
                        <span
                            className={`flex-shrink-0 px-2 py-1 text-sm rounded-full ${getStatusClasses(item.status)}`}
                        >
                            {item.status}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};

export default AtividadeRecente;