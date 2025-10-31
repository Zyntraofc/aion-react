import { useState, useEffect, useRef, useCallback } from 'react';
import { buildQuery } from './utils';
import { buildJustificativasEndpoint } from './registry';

// Colunas simplificadas sem JSX
const JUSTIFICATIVAS_COLUMNS = [
    { id: 'dataHoraBatida', label: 'Data/Hora', accessor: 'dataHoraBatida', visible: true },
    { id: 'cdFuncionario', label: 'ID Funcionário', accessor: 'cdFuncionario', visible: true },
    { id: 'justificativa', label: 'Justificativa', accessor: 'justificativa', visible: true },
    { id: 'status', label: 'Status', accessor: 'status', visible: true },
    { id: 'situacao', label: 'Situação', accessor: 'situacao', visible: true },
    { id: 'actions', label: 'Ações', accessor: null, visible: true }
];

export function useJustificativasController(options = {}) {
    const {
        initialPage = 1,
        perPage = 10,
        initialSort = null,
        initialFilters = {},
        extraQuery = {},
    } = options;

    const [data, setData] = useState([]);
    const [page, setPage] = useState(initialPage);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState(initialSort);
    const [filters, setFilters] = useState(initialFilters);
    const [endpoint, setEndpoint] = useState(null);
    const abortRef = useRef(null);

    useEffect(() => {
        const loadEndpoint = async () => {
            try {
                setLoading(true);
                const url = await buildJustificativasEndpoint();
                console.log('✅ Endpoint carregado:', url);
                setEndpoint(url);
            } catch (err) {
                console.error('❌ Erro ao carregar endpoint:', err);
                setError(err);
                setLoading(false);
            }
        };

        loadEndpoint();
    }, []);

    const fetchData = useCallback(async (opts = {}) => {
        if (!endpoint) {
            console.log('⏳ Aguardando endpoint...');
            return;
        }

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

            if (!user || !pass) {
                throw new Error('Credenciais da API não configuradas');
            }

            const basicAuth = 'Basic ' + btoa(`${user}:${pass}`);

            const qs = buildQuery(q);
            const fullUrl = `${endpoint}${qs}`;

            console.log('🔗 Fazendo requisição para:', fullUrl);

            const res = await fetch(fullUrl, {
                signal: abortRef.current.signal,
                headers: {
                    'Authorization': basicAuth,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 Status da resposta:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Erro na resposta:', errorText);
                throw new Error(errorText || `HTTP ${res.status}`);
            }

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                console.error('❌ Resposta não é JSON:', text.substring(0, 200));
                throw new Error('Resposta do servidor não é JSON');
            }

            const json = await res.json();
            console.log('✅ Dados recebidos:', json);

            const dataArray = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);
            setData(dataArray);
            setTotal(typeof json.total === 'number' ? json.total : dataArray.length);
            setPage(json.page ?? q.page);

        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error('💥 Erro no fetch:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [endpoint, page, perPage, sort, filters, extraQuery]);

    useEffect(() => {
        if (endpoint) {
            fetchData();
        }

        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, [endpoint, page, perPage, sort, filters, fetchData]);

    return {
        data,
        loading: loading || !endpoint,
        error,
        page,
        perPage,
        total,
        setPage,
        setPerPage: () => { },
        setSort,
        setFilters,
        refresh: () => fetchData({}),
        registryColumns: JUSTIFICATIVAS_COLUMNS,
    };
}