import { deepGet } from './utils';

export const registry = {
    justificativas: {
        endpoint: '/api/justificativas',
        columns: [
            { id: 'employee', label: 'Funcionário', accessor: 'employee.name', sortable: true, visible: true },
            { id: 'role', label: '', accessor: row => deepGet(row, 'employee.role') , sortable: false, visible: true },
            { id: 'type', label: 'Tipo', accessor: 'type', sortable: true, visible: true },
            { id: 'date', label: 'Data', accessor: row => (row.date ? new Date(row.date).toLocaleDateString() : ''), sortable: true, visible: true },
            { id: 'status', label: 'Status', accessor: 'status', sortable: true, visible: true, render: (v) => `<Badge>${v}</Badge>` },
            { id: 'priority', label: 'Prioridade', accessor: 'priority', visible: true },
            { id: 'document', label: 'Documento', accessor: 'document.present', visible: true, render: (v, row) => (v ? 'Anexado' : 'Sem documento') },
            { id: 'actions', label: 'Ações', accessor: null, visible: true, render: (v,row) => '...' },
        ],
    },

    colaboradores: {
        endpoint: '/api/colaboradores',
        columns: [
            { id: 'name', label: 'Nome', accessor: 'name', visible: true, sortable: true },
            { id: 'email', label: 'E-mail', accessor: 'email', visible: true },
            { id: 'role', label: 'Cargo', accessor: 'role', visible: true },
            { id: 'status', label: 'Status', accessor: 'status', visible: true },
            { id: 'actions', label: 'Ações', accessor: null, visible: true, render: (v,row) => '...' },
        ],
    },

    onboarding: {
        endpoint: '/api/onboardings',
        columns: [
            { id: 'candidate', label: 'Candidato', accessor: 'candidate.name', visible: true },
            { id: 'startDate', label: 'Data Início', accessor: 'startDate', visible: true },
            { id: 'status', label: 'Status', accessor: 'status', visible: true },
            { id: 'actions', label: 'Ações', accessor: null, visible: true, render: (v,row) => '...' },
        ],
    },
};
