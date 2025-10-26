import { useState, useEffect, useRef, useCallback } from 'react';
import { buildQuery } from './utils';
import { registry } from './registry';

export function useListController(resource, options = {}) {
    const {
        initialPage = 1,
        perPage = 10,
        initialSort = null,
        initialFilters = {},
        extraQuery = {},
    } = options;

    const resourceCfg = registry[resource];
    if (!resourceCfg) throw new Error(`Unknown resource: ${resource}`);

    const [data, setData] = useState([]);
    const [page, setPage] = useState(initialPage);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState(initialSort);
    const [filters, setFilters] = useState(initialFilters);
    const abortRef = useRef(null);

    const fetchData = useCallback(async (opts = {}) => {
        setLoading(true);
        setError(null);
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        const q = {
            page: opts.page ?? page,
            perPage: opts.perPage ?? perPage,
            sort: opts.sort ?? sort,
            filters: opts.filters ?? filters,
            ...extraQuery,
        };
        try {
            const user = import.meta.env.VITE_API_USER;
            const pass = import.meta.env.VITE_API_PASS;
            const basicAuth = 'Basic ' + btoa(`${user}:${pass}`);

            const qs = buildQuery(q);
            const res = await fetch(`${resourceCfg.endpoint}${qs}`, {
                signal: abortRef.current.signal,
                headers: {
                    'Authorization': basicAuth,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || res.statusText);
            }
            const json = await res.json();
            const dataArray = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);
            setData(dataArray);
            setTotal(typeof json.total === 'number' ? json.total : dataArray.length);
            setPage(json.page ?? q.page);

        } catch (err) {
            if (err.name === 'AbortError') return;
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [resourceCfg, page, perPage, sort, filters, extraQuery]);

    useEffect(() => {
        fetchData();
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource, page, perPage, sort, filters]); // resource change will re-run

    return {
        data,
        loading,
        error,
        page,
        perPage,
        total,
        setPage,
        setPerPage: (n) => { /* optional: implement */ },
        setSort,
        setFilters,
        refresh: () => fetchData({}),
        registryColumns: resourceCfg.columns,
    };
}
