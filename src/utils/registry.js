// endpoints.js
import { fetchWithAuth } from './authFetch';
import { getAuth } from "firebase/auth";

function getLoggedEmail() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.email) return Promise.resolve(user.email);

    return new Promise((resolve) => {
        const unsub = auth.onAuthStateChanged((u) => {
            unsub();
            resolve(u?.email ?? null);
        });
    });
}

let cachedCdEmpresa = null;
let gettingCdEmpresaPromise = null;

export async function getEmpresa(email) {
    if (!email) return null;
    if (cachedCdEmpresa) return cachedCdEmpresa;
    if (gettingCdEmpresaPromise) return gettingCdEmpresaPromise;

    gettingCdEmpresaPromise = (async () => {
        try {
            // 1) buscar funcionário por email
            const apiFuncionario = `/api/v1/funcionario/buscar/email/${encodeURIComponent(email)}`;
            const resFunc = await fetchWithAuth(apiFuncionario);
            if (!resFunc.ok) {
                console.error('❌ Erro buscando funcionário:', resFunc.status);
                return null;
            }
            const funcionario = await resFunc.json();

            if (!funcionario || !funcionario.cdDepartamento) {
                console.error('❌ Funcionário inválido ou sem cdDepartamento', funcionario);
                return null;
            }

            // 2) buscar departamento para pegar cdEmpresa
            const apiDepartamento = `/api/v1/departamento/buscar/${funcionario.cdDepartamento}`;
            const resDept = await fetchWithAuth(apiDepartamento);
            if (!resDept.ok) {
                console.error('❌ Erro buscando departamento:', resDept.status);
                return null;
            }
            const departamento = await resDept.json();

            if (!departamento || !departamento.cdEmpresa) {
                console.error('❌ Departamento inválido ou sem cdEmpresa', departamento);
                return null;
            }

            cachedCdEmpresa = departamento.cdEmpresa;
            return cachedCdEmpresa;
        } catch (err) {
            console.error('❌ Erro em getEmpresa:', err);
            return null;
        } finally {
            gettingCdEmpresaPromise = null;
        }
    })();

    return gettingCdEmpresaPromise;
}

export async function buildJustificativasEndpoint() {
    console.log('🔨 Construindo endpoint de justificativas...');
    const email = await getLoggedEmail();
    console.log('📧 Email do usuário logado:', email);

    if (!email) {
        console.error('❌ Usuário não logado');
        return null;
    }

    const cdEmpresa = await getEmpresa(email);
    console.log('🏢 cdEmpresa obtido:', cdEmpresa);

    if (!cdEmpresa) {
        console.error('❌ Não foi possível obter cdEmpresa');
        return null;
    }

    // Mude para caminho relativo - o proxy do Vite vai redirecionar
    const endpoint = `/api/v1/batida/listar/justificativas/${cdEmpresa}`;
    console.log('🔗 Endpoint final construído:', endpoint);
    return endpoint;
}
// Função para construir query string
export function buildQuery(params = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value.toString());
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

export const registry = {
    justificativas: {
        endpoint: null,
        fetchData: async (queryParams = {}) => {
            console.log('🔄 Iniciando fetchData para justificativas');

            const email = await getLoggedEmail();
            if (!email) {
                throw new Error('Usuário não logado');
            }

            const cdEmpresa = await getEmpresa(email);
            if (!cdEmpresa) {
                throw new Error('Não foi possível obter cdEmpresa');
            }

            const qs = buildQuery(queryParams);
            const url = `/api/v1/batida/listar/justificativas/${cdEmpresa}${qs}`;
            console.log('🔗 URL completa:', url);

            const response = await fetchWithAuth(url);
            const json = await response.json();

            // DEBUG: Verificar duplicatas nos dados
            console.log('📊 Dados brutos da API:', json);
            if (Array.isArray(json)) {
                const keys = json.map(item => item.cdFuncionario);
                const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
                if (duplicates.length > 0) {
                    console.warn('⚠️ DUPLICATAS ENCONTRADAS NA API:', duplicates);
                }
            }

            const dataArray = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);

            return {
                data: dataArray,
                total: typeof json.total === 'number' ? json.total : dataArray.length,
                page: json.page || queryParams.page || 1
            };
        },
        columns: [
            {
                id: 'dataHoraBatida',
                label: 'Data/Hora',
                accessor: 'dataHoraBatida',
                visible: true,
                render: (v) => v ? new Date(v).toLocaleString() : '',
            },
            {
                id: 'cdFuncionario',
                label: 'ID Funcionário',
                accessor: 'cdFuncionario',
                visible: true
            },
            {
                id: 'justificativa',
                label: 'Justificativa',
                accessor: 'justificativa',
                visible: true,
                render: (v) => v ? 'Sim' : 'Não',
            },
            {
                id: 'status',
                label: 'Status',
                accessor: 'status',
                visible: true,
                render: (v) => `<Badge>${v === '1' ? 'Válida' : 'Pendente'}</Badge>`,
            },
            {
                id: 'situacao',
                label: 'Situação',
                accessor: 'situacao',
                visible: true
            },
            {
                id: 'actions',
                label: 'Ações',
                accessor: null,
                visible: true,
                render: (v, row) => '...'
            },
        ],
    },

    colaboradores: {
        endpoint: '/api/v1/funcionario/listar',
        fetchData: async (queryParams = {}) => {
            const qs = buildQuery(queryParams);
            const url = `/api/v1/funcionario/listar${qs}`;

            const response = await fetchWithAuth(url);
            const json = await response.json();

            // Transforma a resposta em array consistente
            const dataArray = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);

            return {
                data: dataArray,
                total: typeof json.total === 'number' ? json.total : dataArray.length,
                page: json.page || queryParams.page || 1
            };
        },
        columns: [
            {
                id: 'nomeCompleto',
                label: 'Nome',
                accessor: 'nomeCompleto',
                visible: true,
                sortable: true
            },
            {
                id: 'cdMatricula',
                label: 'Matrícula',
                accessor: 'cdMatricula',
                visible: true
            },
            {
                id: 'cdCargo',
                label: 'Cargo',
                accessor: 'cdCargo',
                visible: true,
            },
            {
                id: 'cdDepartamento',
                label: 'Setor',
                accessor: 'cdDepartamento',
                visible: true,
            },
            {
                id: 'ativo',
                label: 'Status',
                accessor: 'ativo',
                visible: true,
                render: (v) => (v === '1' || v === 1 ? 'Ativo' : 'Inativo'),
            },
            {
                id: 'faltas',
                label: 'Faltas (mês)',
                accessor: 'faltas',
                visible: true,
                render: (v) => v ?? '0'
            },
            {
                id: 'actions',
                label: 'Ações',
                accessor: null,
                visible: true,
                render: (v, row) => '...'
            },
        ],
    },
};

// Exportação padrão para compatibilidade
export default registry;