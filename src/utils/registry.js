// endpoints.js
import { fetchWithAuth } from './authFetch'; // usado por getEmpresa
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

/* -------------------------
   getEmpresa(email) — retorna cdEmpresa (usa fetchWithAuth internamente)
   ------------------------- */
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
                console.error('Erro buscando funcionário:', resFunc.status);
                return null;
            }
            const funcionario = await resFunc.json();
            if (!funcionario || !funcionario.cdDepartamento) {
                console.error('Funcionário inválido ou sem cdDepartamento', funcionario);
                return null;
            }

            // 2) buscar departamento para pegar cdEmpresa
            const apiDepartamento = `/api/v1/departamento/buscar/${funcionario.cdDepartamento}`;
            const resDept = await fetchWithAuth(apiDepartamento);
            if (!resDept.ok) {
                console.error('Erro buscando departamento:', resDept.status);
                return null;
            }
            const departamento = await resDept.json();
            if (!departamento || !departamento.cdEmpresa) {
                console.error('Departamento inválido ou sem cdEmpresa', departamento);
                return null;
            }

            cachedCdEmpresa = departamento.cdEmpresa;
            return cachedCdEmpresa;
        } catch (err) {
            console.error('Erro em getEmpresa:', err);
            return null;
        } finally {
            gettingCdEmpresaPromise = null;
        }
    })();

    return gettingCdEmpresaPromise;
}

/* -------------------------
   buildJustificativasEndpoint() — constrói a URL completa fora do registry
   NÃO faz fetch: apenas retorna a string da URL
   ------------------------- */
export async function buildJustificativasEndpoint() {
    const email = await getLoggedEmail();
    if (!email) {
        console.error('Usuário não logado — não foi possível montar endpoint de justificativas');
        return null;
    }

    const cdEmpresa = await getEmpresa(email);
    if (!cdEmpresa) {
        console.error('Não foi possível obter cdEmpresa para o usuário', email);
        return null;
    }

    // URL completa — ajuste domínio se preferir usar endpoint relativo
    return `https://ms-aion-jpa.onrender.com/api/v1/batida/listar/justificativas/${cdEmpresa}`;
}

export const registry = {
    justificativas: {
        endpoint: buildJustificativasEndpoint(),
        columns: [
            {
                id: 'dataHoraBatida', label: 'Data/Hora', accessor: 'dataHoraBatida', visible: true,
                render: (v) => v ? new Date(v).toLocaleString() : '',
            },
            { id: 'cdFuncionario', label: 'ID Funcionário', accessor: 'cdFuncionario', visible: true },
            {
                id: 'justificativa', label: 'Justificativa', accessor: 'justificativa', visible: true,
                render: (v) => v ? 'Sim' : 'Não',
            },
            {
                id: 'status', label: 'Status', accessor: 'status', visible: true,
                render: (v) => `<Badge>${v === '1' ? 'Válida' : 'Pendente'}</Badge>`,
            },
            { id: 'situacao', label: 'Situação', accessor: 'situacao', visible: true },
            { id: 'actions', label: 'Ações', accessor: null, visible: true, render: (v, row) => '...' },
        ],
    },

    colaboradores: {
        endpoint: '/api/v1/funcionario/listar',
        fetchData: () => fetchWithAuth('/api/v1/funcionario/listar'),
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
                accessor: 'nome',
                visible: true,
            },
            {
                id: 'cdDepartamento',
                label: 'Setor',
                accessor: 'nome',
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
                render: (v) => v ?? '0' // Placeholder - você precisará de um endpoint para faltas
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
