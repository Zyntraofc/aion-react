import React, { useMemo } from 'react';
import { useListController } from '../../utils/useListController.js';
import { deepGet } from '../../utils/utils.js';

/**
 * props:
 *   resource: 'justificativas' | 'colaboradores' | ...
 *   visibleColumns?: array of column ids to show (overrides defaults)
 *   columnOverrides?: { [colId]: { visible?: bool, render?: fn, label?: string } }
 *   actions?: custom actions render fn
 */
export default function GenericList({ resource, visibleColumns, columnOverrides = {}, initialFilters = {} }) {
    const { data, loading, error, page, total, setPage, setSort, setFilters, refresh, registryColumns } =
        useListController(resource, { initialFilters });

    // merge registry columns + overrides + visibleColumns
    const columns = useMemo(() => {
        const byId = {};
        registryColumns.forEach(c => byId[c.id] = { ...c });
        // apply overrides
        for (const [id, o] of Object.entries(columnOverrides)) {
            if (!byId[id]) continue;
            byId[id] = { ...byId[id], ...o };
        }
        let out = Object.values(byId);
        if (Array.isArray(visibleColumns)) {
            out = out.filter(c => visibleColumns.includes(c.id));
        } else {
            out = out.filter(c => c.visible !== false);
        }
        return out;
    }, [registryColumns, columnOverrides, visibleColumns]);

    return (
        <div className="generic-list">
            {loading && <div>Carregando...</div>}
            {error && <div className="text-danger">Erro: {String(error.message || error)}</div>}

            <table className="table w-full">
                <thead>
                <tr className='align-baseline'>
                    {columns.map(col => (
                        <th key={col.id} className='text-left'>{col.label || col.id}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, i) => (
                    <tr key={row.cdMatricula ?? row.id ?? i}>
                        {columns.map(col => {
                            let value;
                            if (typeof col.accessor === 'function') value = col.accessor(row);
                            else if (typeof col.accessor === 'string') value = deepGet(row, col.accessor);
                            else value = undefined;

                            if (col.render) {
                                // render may return React or string
                                return <td key={col.id}>{col.render(value, row)}</td>;
                            }
                            return <td key={col.id}>{value ?? ''}</td>;
                        })}
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination justify-between">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className='cursor-pointer hover:opacity-80'>Anterior</button>
                <span>{page} / {Math.ceil((total || 0) / 10)}</span>
                <button onClick={() => setPage(page + 1)} disabled={page * 10 >= total} className='cursor-pointer hover:opacity-80'>Próxima</button>
                <button onClick={() => refresh()} className='cursor-pointer hover:opacity-80'>Refresh</button>
            </div>
        </div>
    );
}
