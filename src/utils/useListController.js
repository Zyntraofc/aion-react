import { useState, useEffect, useRef, useCallback } from 'react';
import { buildQuery } from './utils';
import { registry } from '../utils/registry';

export function useListController(resource, options = {}) {
    const {
        initialPage = 1,
        perPage = 10,
        initialSort = null,
        initialFilters = {},
        extraQuery = {},
    } = options;

    const resourceCfg = registry[resource];
    if (!resourceCfg) {
        console.error(`❌ Recurso desconhecido: ${resource}`);
        throw new Error(`Unknown resource: ${resource}`);
    }

    const [data, setData] = useState([]);
    const [page, setPage] = useState(initialPage);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState(initialSort);
    const [filters, setFilters] = useState(initialFilters);

    const abortRef = useRef(null);
    const retryCountRef = useRef(0);
    const maxRetries = 2;
    const isMountedRef = useRef(true);

    // Função principal de fetch
    const fetchData = useCallback(async (opts = {}) => {
        if (!isMountedRef.current) return;

        // Verificar se já excedeu o número máximo de tentativas
        if (retryCountRef.current >= maxRetries) {
            console.error(`❌ Número máximo de tentativas (${maxRetries}) atingido para ${resource}`);
            setLoading(false);
            setError(new Error(`Falha após ${maxRetries} tentativas`));
            return;
        }

        setLoading(true);
        setError(null);

        // Cancelar requisição anterior
        if (abortRef.current) {
            abortRef.current.abort();
        }
        abortRef.current = new AbortController();

        try {
            console.log(`🔄 Buscando dados para recurso: ${resource} (tentativa ${retryCountRef.current + 1})`);

            // Usar a função fetchData do registry
            const result = await resourceCfg.fetchData({
                page: opts.page ?? page,
                perPage: opts.perPage ?? perPage,
                sort: opts.sort ?? sort,
                filters: opts.filters ?? filters,
                ...extraQuery,
            });

            console.log(`📊 Dados recebidos para ${resource}:`, result);

            if (!isMountedRef.current) return;

            setData(result.data || []);
            setTotal(result.total || result.data?.length || 0);
            setPage(result.page || (opts.page ?? page));

            // Resetar contador em caso de sucesso
            retryCountRef.current = 0;

        } catch (err) {
            if (!isMountedRef.current) return;

            if (err.name === 'AbortError') {
                console.log('⏹️ Requisição cancelada');
                return;
            }

            console.error(`❌ Erro ao buscar ${resource} (tentativa ${retryCountRef.current + 1}):`, err);

            // Incrementar contador de tentativas
            retryCountRef.current += 1;

            // Se ainda não atingiu o máximo, tentar novamente
            if (retryCountRef.current < maxRetries) {
                console.log(`🔄 Tentando novamente (${retryCountRef.current + 1}/${maxRetries})...`);
                setTimeout(() => {
                    if (isMountedRef.current) {
                        fetchData(opts);
                    }
                }, 1000 * retryCountRef.current); // Backoff exponencial
            } else {
                setError(err);
                setLoading(false);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [resource, resourceCfg, page, perPage, sort, filters, extraQuery]);

    // useEffect principal - CORRIGIDO para evitar loops
    useEffect(() => {
        isMountedRef.current = true;
        retryCountRef.current = 0;

        console.log(`🎯 Iniciando fetch para: ${resource}`);
        fetchData();

        return () => {
            console.log(`🧹 Limpando useListController para: ${resource}`);
            isMountedRef.current = false;
            if (abortRef.current) {
                abortRef.current.abort();
            }
        };
    }, [resource]); // Apenas resource como dependência - isso evita loops

    // Funções de atualização que não causam re-render desnecessário
    const refresh = useCallback(() => {
        retryCountRef.current = 0;
        fetchData({ page: 1 });
    }, [fetchData]);

    const handleSetPage = useCallback((newPage) => {
        setPage(newPage);
        fetchData({ page: newPage });
    }, [fetchData]);

    const handleSetFilters = useCallback((newFilters) => {
        setFilters(newFilters);
        retryCountRef.current = 0;
        fetchData({ page: 1, filters: newFilters });
    }, [fetchData]);

    const handleSetSort = useCallback((newSort) => {
        setSort(newSort);
        retryCountRef.current = 0;
        fetchData({ page: 1, sort: newSort });
    }, [fetchData]);

    const resetRetries = useCallback(() => {
        retryCountRef.current = 0;
    }, []);

    return {
        data,
        loading,
        error,
        page,
        perPage,
        total,
        setPage: handleSetPage,
        setPerPage: () => { /* implementar se necessário */ },
        setSort: handleSetSort,
        setFilters: handleSetFilters,
        refresh,
        resetRetries,
        registryColumns: resourceCfg.columns || [],
    };
}