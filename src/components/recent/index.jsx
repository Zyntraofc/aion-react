import { HistoryIcon } from "lucide-react";
import React from "react";

const AtividadeRecente = ({
                              dados = [],
                              limite = 3,
                              carregando = false
                          }) => {
    // Ordena por data e limita a quantidade de itens
    const solicitacoes = dados
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, limite);

    if (carregando) {
        return (
            <div className="p-6 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center space-x-2">
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

    return (
        <div className="p-6 rounded-2xl bg-white shadow-sm">
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
                        className="p-4.5 mb-4 rounded-xl bg-secondary-100 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">{item.usuario}</p>
                            <p className="text-sm text-gray-500">
                                {item.motivo} • {new Date(item.data).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                            </p>
                        </div>

                        <span
                            className={`px-2 py-1 text-sm rounded-full ${
                                item.status === "Aprovada"
                                    ? "border border-green-200 text-success"
                                    : "bg-danger text-white border border-red-200"
                            }`}
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