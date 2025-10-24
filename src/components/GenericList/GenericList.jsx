import React, { useMemo, useState, useRef, useEffect } from "react";
import { useListController } from "../../utils/useListController.js";
import { deepGet } from "../../utils/utils.js";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

export default function GenericList({
                                        resource,
                                        visibleColumns,
                                        columnOverrides = {},
                                        initialFilters = {},
                                        onViewEmployee
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
    const menuRef = useRef(null);

    // Fechar menu quando clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const columns = useMemo(() => {
        const byId = {};
        registryColumns.forEach((c) => (byId[c.id] = { ...c }));
        for (const [id, o] of Object.entries(columnOverrides)) {
            if (!byId[id]) continue;
            byId[id] = { ...byId[id], ...o };
        }
        let out = Object.values(byId);
        if (Array.isArray(visibleColumns)) {
            out = out.filter((c) => visibleColumns.includes(c.id));
        } else {
            out = out.filter((c) => c.visible !== false);
        }
        return out;
    }, [registryColumns, columnOverrides, visibleColumns]);

    const handleActionClick = (action, row) => {
        console.log(`${action} clicked for row:`, row);
        setOpenMenuId(null);

        // Adicione esta parte:
        if (action === "visualizar" && onViewEmployee) {
            onViewEmployee(row); // Chama a função passada pela página
        }
    };

    return (
        <div className="generic-list bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm transition hover:bg-gray-50 rounded-xl">
                    {columns.map((col) => (
                        <th key={col.id} className="py-3 px-4 font-medium transition">
                            {col.label || col.id}
                        </th>
                    ))}
                    <th className="py-3 px-4 font-medium">Ações</th>
                </tr>
                </thead>

                <tbody>
                {/* Estados de loading, error e vazio permanecem iguais */}
                {loading && (
                    <tr>
                        <td colSpan={columns.length + 1} className="py-10 text-center text-gray-500">
                            Carregando...
                        </td>
                    </tr>
                )}

                {!loading && error && (
                    <tr>
                        <td colSpan={columns.length + 1} className="py-10 text-center text-red-500">
                            Erro: {String(error.message || error)}
                        </td>
                    </tr>
                )}

                {!loading && !error && (!data || data.length === 0) && (
                    <tr>
                        <td colSpan={columns.length + 1} className="py-10 text-center text-gray-400">
                            Nenhum registro encontrado.
                        </td>
                    </tr>
                )}

                {/* Dados normais */}
                {!loading &&
                    !error &&
                    data &&
                    data.map((row, i) => {
                        const rowId = row.cdMatricula ?? row.id ?? i;
                        return (
                            <tr
                                key={rowId}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                {columns.map((col) => {
                                    let value;
                                    if (typeof col.accessor === "function")
                                        value = col.accessor(row);
                                    else if (typeof col.accessor === "string")
                                        value = deepGet(row, col.accessor);
                                    else value = undefined;

                                    if (col.render) {
                                        return (
                                            <td key={col.id} className="py-4 px-4">
                                                {col.render(value, row)}
                                            </td>
                                        );
                                    }

                                    // Renderizações específicas para cada coluna...
                                    if (col.id === "nmColaborador") {
                                        return (
                                            <td key={col.id} className="py-4 px-4">
                                                <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-900">
                                                            {value || "—"}
                                                        </span>
                                                    <span className="text-gray-400 text-sm">
                                                            {row.dsEmail || ""}
                                                        </span>
                                                </div>
                                            </td>
                                        );
                                    }

                                    if (col.id === "dsSetor") {
                                        return (
                                            <td key={col.id} className="py-4 px-4">
                                                    <span className="px-3 py-1 rounded-full bg-gray-50 border text-gray-600 text-sm">
                                                        {value}
                                                    </span>
                                            </td>
                                        );
                                    }

                                    if (col.id === "dsStatus") {
                                        return (
                                            <td key={col.id} className="py-4 px-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm border ${
                                                            value === "Ativo"
                                                                ? "bg-green-50 text-green-600 border-green-200"
                                                                : "bg-gray-100 text-gray-500 border-gray-200"
                                                        }`}
                                                    >
                                                        {value}
                                                    </span>
                                            </td>
                                        );
                                    }

                                    if (col.id === "qtFaltas") {
                                        return (
                                            <td key={col.id} className="py-4 px-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            value > 0
                                                                ? "bg-red-600 text-white"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}
                                                    >
                                                        {value ?? 0}
                                                    </span>
                                            </td>
                                        );
                                    }

                                    return (
                                        <td key={col.id} className="py-4 px-4 text-gray-700">
                                            {value ?? ""}
                                        </td>
                                    );
                                })}

                                {/* Ações com menu dropdown */}
                                <td className="py-4 px-4 text-right relative" ref={menuRef}>
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-100 transition"
                                        onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)}
                                    >
                                        <MoreHorizontal size={18} className="text-gray-500" />
                                    </button>

                                    {openMenuId === rowId && (
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                            <button
                                                onClick={() => handleActionClick("visualizar", row)}
                                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <Eye size={16} className="mr-2" />
                                                Visualizar
                                            </button>
                                            <button
                                                onClick={() => handleActionClick("editar", row)}
                                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <Edit size={16} className="mr-2" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleActionClick("deletar", row)}
                                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <Trash2 size={16} className="mr-2" />
                                                Deletar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Paginação */}
            {!loading && !error && data?.length > 0 && (
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page <= 1}
                        className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span>
                        Página {page} / {Math.ceil((total || 0) / 10)}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page * 10 >= total}
                        className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Próxima
                    </button>
                    <button
                        onClick={() => refresh()}
                        className="ml-3 px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                        Refresh
                    </button>
                </div>
            )}
        </div>
    );
}