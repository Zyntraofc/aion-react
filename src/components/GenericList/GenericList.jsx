import React, { useMemo, useState, useEffect } from "react";
import { useListController } from "../../utils/useListController.js";
import { deepGet } from "../../utils/utils.js";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";


export default function GenericList({
                                        resource,
                                        visibleColumns = ['nomeCompleto', 'cdMatricula', 'cdCargo', 'cdDepartamento', 'ativo', 'faltas', 'actions'],
                                        columnOverrides = {},
                                        initialFilters = {},
                                        onViewEmployee,
                                        onEditEmployee,
                                        onDeleteEmployee
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
        console.log("Ação:", action, "Colaborador:", row);
        setOpenMenuId(null);

        switch (action) {
            case "visualizar":
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
            <span className="font-semibold text-gray-900 truncate">
              {value || "—"}
            </span>
                        {row.email && (
                            <span className="text-gray-400 text-xs truncate">
                {row.email}
              </span>
                        )}
                    </div>
                );

            case "cdMatricula":
                return (
                    <span className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
            {value || "—"}
          </span>
                );

            case "cdCargo":
                return (
                    <div className="text-gray-700">
                        {value ? `ID: ${value}` : "Não definido"}
                    </div>
                );

            case "cdDepartamento":
                return (
                    <div className="text-gray-700">
                        {value ? `ID: ${value}` : "Não definido"}
                    </div>
                );

            case "ativo":
                const isActive = value === true || value === 1 || value === "1";
                return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        isActive
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                    }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
                isActive ? "bg-green-500" : "bg-red-500"
            }`}></span>
                        {isActive ? "Ativo" : "Inativo"}
          </span>
                );

            case "faltas":
                const faltasCount = parseInt(value) || 0;
                return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        faltasCount > 0
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-green-100 text-green-800 border-green-200"
                    }`}>
            {faltasCount > 0 && (
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            )}
                        {faltasCount}
          </span>
                );

            default:
                return (
                    <span className="text-gray-700">
            {value ?? "—"}
          </span>
                );
        }
    };

    // Componente de paginação
    const Pagination = () => {
        const totalPages = Math.ceil(total / 10);
        const startItem = (page - 1) * 10 + 1;
        const endItem = Math.min(page * 10, total);

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 gap-3">
                <div className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{startItem}</span> a{" "}
                    <span className="font-medium">{endItem}</span> de{" "}
                    <span className="font-medium">{total}</span> resultados
                </div>

                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => setPage(1)}
                        disabled={page <= 1}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Primeira página"
                    >
                        ⏮️
                    </button>

                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Anterior
                    </button>

                    <span className="text-sm text-gray-700 px-3 py-1 bg-white border border-gray-300 rounded-md">
            Página {page} de {totalPages}
          </span>

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Próxima
                    </button>

                    <button
                        onClick={() => setPage(totalPages)}
                        disabled={page >= totalPages}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Última página"
                    >
                        ⏭️
                    </button>

                    <button
                        onClick={() => refresh()}
                        className="ml-2 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        title="Atualizar dados"
                    >
                        🔄
                    </button>
                </div>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600">Carregando colaboradores...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-center py-8">
                    <div className="text-red-500 text-lg font-semibold mb-2">
                        Erro ao carregar dados
                    </div>
                    <div className="text-gray-600 text-sm">
                        {error.message || "Erro desconhecido"}
                    </div>
                    <button
                        onClick={() => refresh()}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">
                        Nenhum colaborador encontrado
                    </div>
                    <div className="text-gray-500 text-sm mb-4">
                        Não há dados para exibir no momento.
                    </div>
                    <button
                        onClick={() => refresh()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Recarregar
                    </button>
                </div>
            </div>
        );
    }

    // Main table
    return (
        <div className="generic-list bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        {columns.map((col) => (
                            <th
                                key={col.id}
                                className="py-4 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap"
                            >
                                {col.label || col.id}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {data.map((row, index) => {
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
                                        return (
                                            <td key="actions" className="py-3 px-4 whitespace-nowrap">
                                                <div className="flex justify-end">
                                                    <div className="relative">
                                                        <button
                                                            className="menu-button p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
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
                                                                    onClick={() => handleAction("visualizar", row)}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                                                >
                                                                    <Eye size={16} className="mr-3 text-blue-500" />
                                                                    Visualizar
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
                                        <td key={col.id} className="py-4 px-4 whitespace-nowrap">
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