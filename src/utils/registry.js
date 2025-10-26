const startEndpoint = 'https://ms-aion-jpa.onrender.com'
export const registry = {
    justificativas: {
        endpoint: startEndpoint+'/api/v1/batida/listar',
        columns: [
            { id: 'dataHoraBatida', label: 'Data/Hora', accessor: 'dataHoraBatida', visible: true,
                render: (v) => v ? new Date(v).toLocaleString() : '',
            },
            { id: 'cdFuncionario', label: 'ID Funcionário', accessor: 'cdFuncionario', visible: true },
            { id: 'justificativa', label: 'Justificativa', accessor: 'justificativa', visible: true,
                render: (v) => v ? 'Sim' : 'Não',
            },
            { id: 'status', label: 'Status', accessor: 'status', visible: true,
                render: (v) => `<Badge>${v === '1' ? 'Válida' : 'Pendente'}</Badge>`,
            },
            { id: 'situacao', label: 'Situação', accessor: 'situacao', visible: true },
            { id: 'actions', label: 'Ações', accessor: null, visible: true, render: (v, row) => '...' },
        ],
    },

    colaboradores: {
        endpoint: startEndpoint + '/api/v1/funcionario/listar',
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
                render: (value, row) => {
                    // Isso será substituído quando tivermos os dados dos cargos
                    return value || "Não definido";
                }
            },
            {
                id: 'cdDepartamento',
                label: 'Setor',
                accessor: 'cdDepartamento',
                visible: true,
                render: (value, row) => {
                    // Isso será substituído quando tivermos os dados dos departamentos
                    return value || "Não definido";
                }
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

    onboarding: {
        endpoint: startEndpoint+'/api/onboardings',
        columns: [
            { id: 'candidate', label: 'Candidato', accessor: 'candidate.name', visible: true },
            { id: 'startDate', label: 'Data Início', accessor: 'startDate', visible: true },
            { id: 'status', label: 'Status', accessor: 'status', visible: true },
            { id: 'actions', label: 'Ações', accessor: null, visible: true, render: (v,row) => '...' },
        ],
    },
};
