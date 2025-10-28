import React, { useMemo, useState, useEffect } from "react";
import { useListController } from "../../utils/useListController.js";
import { deepGet } from "../../utils/utils.js";
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle } from "lucide-react";

export default function GenericList({
                                        resource,
                                        visibleColumns = ['nomeCompleto', 'cdMatricula', 'cdCargo', 'cdDepartamento', 'ativo', 'faltas', 'actions'],
                                        columnOverrides = {},
                                        initialFilters = {},
                                        onViewEmployee,
                                        onEditEmployee,
                                        onDeleteEmployee,
                                        actionType = "default"
                                    }) {
    const {
        data,
        loading,
        error,
        page,
        total,
        setPage,
        refresh,
        registryColumns,
    } = useListController(resource, { initialFilters });

    const [openMenuId, setOpenMenuId] = useState(null);
    const itemsPerPage = 10;

    // Dados paginados para exibição
    const paginatedData = useMemo(() => {
        if (!data || data.length === 0) return [];
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, page, itemsPerPage]);

    // Configuração das colunas
    const columns = useMemo(() => {
        const byId = {};
        registryColumns.forEach((c) => (byId[c.id] = { ...c }));

        // Aplicar overrides
        for (const [id, o] of Object.entries(columnOverrides)) {
            if (!byId[id]) continue;
            byId[id] = { ...byId[id], ...o };
        }

        let out = Object.values(byId);

        // Filtrar colunas visíveis
        if (Array.isArray(visibleColumns)) {
            out = out.filter((c) => visibleColumns.includes(c.id));
        } else {
            out = out.filter((c) => c.visible !== false);
        }

        return out;
    }, [registryColumns, columnOverrides, visibleColumns]);

    // Fechar menu quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.action-menu') && !event.target.closest('.menu-button')) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Manipulador de ações
    const handleAction = (action, row) => {
        console.log("🔍 Ação disparada:", action, "Dados:", row);
        setOpenMenuId(null);

        switch (action) {
            case "Analisar":
                console.log("📝 Chamando onViewEmployee (Analisar)");
                onViewEmployee?.(row);
                break;
            case "analisar": // ← Este é o importante para o modo justificativa
                console.log("📝 Chamando onViewEmployee (analisar)");
                onViewEmployee?.(row);
                break;
            case "editar":
                onEditEmployee?.(row);
                break;
            case "deletar":
                onDeleteEmployee?.(row);
                break;
            default:
                console.warn("Ação desconhecida:", action);
        }
    };

    // Função para determinar o texto e estilo do botão baseado no status
    // No GenericList, na função getActionButtonConfig - VERIFIQUE se está assim:
    // No GenericList, SUBSTITUA a função getActionButtonConfig por esta:
    const getActionButtonConfig = (row) => {
        // Para o modo justificativa, SEMPRE mostrar "Analisar" independente do status
        if (actionType === "justificativa") {
            const status = row.status || row.dsStatus || "";
            const isPendente = status.toLowerCase().includes("pendente");

            if (isPendente) {
                return {
                    text: "Analisar",
                    className: "bg-blue-600 hover:bg-blue-700 text-white",
                    icon: <CheckCircle size={16} className="mr-2" />,
                    action: "analisar"
                };
            } else {
                // Mesmo para justificativas já analisadas, mostrar "Analisar"
                // mas com estilo diferente para indicar que já foi vista
                return {
                    text: "Analisar",
                    className: "hover:bg-gray-200 text-black",
                    icon: <Eye size={16} className="mr-2" />,
                    action: "analisar"
                };
            }
        }

        // Para outros tipos (modo padrão), manter a lógica original
        const status = row.status || row.dsStatus || "";
        const isPendente = status.toLowerCase().includes("pendente");

        if (isPendente) {
            return {
                text: "Analisar",
                className: "bg-blue-600 hover:bg-blue-700 text-white",
                icon: <CheckCircle size={16} className="mr-2" />,
                action: "analisar"
            };
        } else {
            return {
                text: "Visualizar",
                className: "border hover:bg-gray-200 text-black",
                icon: <Eye size={16} className="mr-2" />,
                action: "Analisar"
            };
        }
    };

    // Função para renderizar o valor da célula com estilos específicos
    const renderCellValue = (col, row) => {
        let value;
        if (typeof col.accessor === "function") {
            value = col.accessor(row);
        } else if (typeof col.accessor === "string") {
            value = deepGet(row, col.accessor);
        } else {
            value = row[col.id];
        }

        // Usar render personalizado se existir
        if (col.render && typeof col.render === 'function') {
            return col.render(value, row);
        }

        // Renderizações específicas para cada coluna
        switch (col.id) {
            case "nomeCompleto":
                return (
                    <div className="flex flex-col min-w-0">
                        <span className="font-medium text-gray-900 truncate">
                            {value || "—"}
                        </span>
                        {row.email && (
                            <span className="text-gray-500 text-sm truncate">
                                {row.email}
                            </span>
                        )}
                    </div>
                );

            case "cdMatricula":
                return (
                    <span className="font-mono text-sm text-gray-700 font-medium">
                        {value || "—"}
                    </span>
                );

            case "cdCargo":
                return (
                    <div className="text-gray-700">
                        {value || "Não definido"}
                    </div>
                );

            case "cdDepartamento":
                return (
                    <div className="text-gray-700 border-1 pl-3 pr-3 rounded-xl border-gray-200">
                        {value ? (value === "(T)" || value === "(RH)" ? value : value) : "Não definido"}
                    </div>
                );

            case "ativo":
                const isActive = value === true || value === 1 || value === "1" || value === "Ativo";
                return (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}>
                        {isActive ? "Ativo" : "Inativo"}
                    </span>
                );

            case "faltas":
                const faltasCount = parseInt(value) || 0;
                return (
                    <span className="text-gray-700 font-medium">
                        {faltasCount}
                    </span>
                );

            case "status":
                if (actionType === "justificativa") {
                    const status = value || "";
                    const isPendente = status.toLowerCase().includes("pendente");
                    const isAprovada = status.toLowerCase().includes("aprovada");
                    const isRecusada = status.toLowerCase().includes("recusada") || status.toLowerCase().includes("incorrente");

                    let statusClass = "bg-gray-100 text-gray-800";
                    if (isPendente) statusClass = "bg-yellow-100 text-yellow-800";
                    if (isAprovada) statusClass = "bg-green-100 text-green-800";
                    if (isRecusada) statusClass = "bg-red-100 text-red-800";

                    return (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                            {status}
                        </span>
                    );
                }
                break;

            case "prioridade":
                if (actionType === "justificativa") {
                    const prioridade = value || "";
                    const isAlta = prioridade.toLowerCase().includes("alta") || prioridade === "SED";
                    const isMedia = prioridade.toLowerCase().includes("média") || prioridade.toLowerCase().includes("media");
                    const isBaixa = prioridade.toLowerCase().includes("baixa");

                    let prioridadeClass = "bg-gray-100 text-gray-800";
                    if (isAlta) prioridadeClass = "bg-red-100 text-red-800";
                    if (isMedia) prioridadeClass = "bg-yellow-100 text-yellow-800";
                    if (isBaixa) prioridadeClass = "bg-green-100 text-green-800";

                    return (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${prioridadeClass}`}>
                            {prioridade}
                        </span>
                    );
                }
                break;

            case "documento":
                if (actionType === "justificativa") {
                    const documento = value || "";
                    const hasDocument = documento.toLowerCase().includes("anexado");

                    return (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            hasDocument
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                        }`}>
                            {documento}
                        </span>
                    );
                }
                break;

            default:
                return (
                    <span className="text-gray-700">
                        {value ?? "—"}
                    </span>
                );
        }

        // Fallback para colunas não tratadas especificamente
        return (
            <span className="text-gray-700">
                {value ?? "—"}
            </span>
        );
    };

    // Componente de paginação
    const Pagination = () => {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const startItem = (page - 1) * itemsPerPage + 1;
        const endItem = Math.min(page * itemsPerPage, data.length);

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-white gap-3">
                <div className="text-sm text-gray-600">
                    Mostrando <span className="font-medium">{startItem}</span> a{" "}
                    <span className="font-medium">{endItem}</span> de{" "}
                    <span className="font-medium">{total}</span> resultados
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
                    >
                        Anterior
                    </button>

                    <span className="text-sm text-gray-700 px-3 py-2">
                    Página {page} de {totalPages}
                </span>

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
                    >
                        Próxima
                    </button>

                    <button
                        onClick={() => refresh()}
                        className="ml-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700"
                        title="Atualizar dados"
                    >
                        Atualizar
                    </button>
                </div>
            </div>
        );
    };

    // Loading state - PRIMEIRO: sempre verificar loading antes de qualquer coisa
    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Carregando colaboradores...</span>
                </div>
            </div>
        );
    }

    // Error state - SEGUNDO: verificar erro depois do loading
    if (error) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center py-8">
                    <div className="text-red-500 text-lg font-semibold mb-2">
                        Erro ao carregar dados
                    </div>
                    <div className="text-gray-600 text-sm">
                        {error.message || "Erro desconhecido"}
                    </div>
                    <button
                        onClick={() => refresh()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    // Empty state - TERCEIRO: só verificar dados vazios depois de confirmar que não está loading e não há erro
    if (!paginatedData || paginatedData.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">
                        Nenhum colaborador encontrado
                    </div>
                    <div className="text-gray-500 text-sm mb-4">
                        Não há dados para exibir no momento.
                    </div>
                    <button
                        onClick={() => refresh()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Recarregar
                    </button>
                </div>
            </div>
        );
    }

    // Main table - ÚLTIMO: só renderizar a tabela se não está loading, não há erro e há dados
    return (
        <div className="generic-list bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        {columns.map((col) => (
                            <th
                                key={col.id}
                                className="py-3 px-6 font-semibold text-gray-700 text-sm tracking-normal whitespace-nowrap"
                            >
                                {col.label || col.id}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {paginatedData.map((row, index) => {
                        const rowId = row.cdFuncionario ?? row.cdMatricula ?? row.id ?? index;
                        const isMenuOpen = openMenuId === rowId;

                        return (
                            <tr
                                key={rowId}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                            >
                                {columns.map((col) => {
                                    // Coluna de Ações
                                    if (col.id === "actions") {
                                        // Modo justificativa - botões específicos
                                        if (actionType === "justificativa") {
                                            const buttonConfig = getActionButtonConfig(row);
                                            return (
                                                <td key="actions" className="py-3 px-6">
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => handleAction(buttonConfig.action, row)}
                                                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${buttonConfig.className}`}
                                                        >
                                                            {buttonConfig.icon}
                                                            {buttonConfig.text}
                                                        </button>
                                                    </div>
                                                </td>
                                            );
                                        }

                                        // Modo padrão - menu de três pontinhos
                                        return (
                                            <td key="actions" className="py-3 px-6">
                                                <div className="flex">
                                                    <div className="relative">
                                                        <button
                                                            className="menu-button p-2 rounded hover:bg-gray-200 transition-colors duration-200"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenMenuId(isMenuOpen ? null : rowId);
                                                            }}
                                                        >
                                                            <MoreHorizontal size={18} className="text-gray-600" />
                                                        </button>

                                                        {isMenuOpen && (
                                                            <div className="action-menu absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                                                                <button
                                                                    onClick={() => handleAction("Analisar", row)}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                                                >
                                                                    <Eye size={16} className="mr-3 text-blue-500" />
                                                                    Analisar
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAction("editar", row)}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                                                >
                                                                    <Edit size={16} className="mr-3 text-green-500" />
                                                                    Editar
                                                                </button>
                                                                <div className="border-t border-gray-100">
                                                                    <button
                                                                        onClick={() => handleAction("deletar", row)}
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                                    >
                                                                        <Trash2 size={16} className="mr-3" />
                                                                        Deletar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    }

                                    // Demais colunas
                                    return (
                                        <td key={col.id} className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {renderCellValue(col, row)}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Paginação */}
            <Pagination />
        </div>
    );
}