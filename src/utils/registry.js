const proxyEndpoint = 'http://localhost:3001'; // sem /proxy

export const registry = {
    justificativas: {
        endpoint: proxyEndpoint + '/api/v1/batida/listar',
        columns: [
            { id: 'dataHoraBatida', label: 'Data/Hora', accessor: 'dataHoraBatida', visible: true,
                render: (v) => v ? new Date(v).toLocaleString() : '',
            },
            { id: 'cdFuncionario', label: 'ID Funcionário', accessor: 'cdFuncionario', visible: true },
            { id: 'justificativa', label: 'Justificativa', accessor: 'justificativa', visible: true,
                render: (v) => v ? 'Sim' : 'Não',
            },
            { id: 'status', label: 'Status', accessor: 'status', visible: true,
                render: (v) => v === '1' ? 'Válida' : 'Pendente',
            },
            { id: 'situacao', label: 'Situação', accessor: 'situacao', visible: true },
            { id: 'actions', label: 'Ações', accessor: null, visible: true, render: (v, row) => '...' },
        ],
    },

    colaboradores: {
        endpoint: proxyEndpoint + '/api/v1/funcionario/listar',
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
                    return value || "Não definido";
                }
            },
            {
                id: 'cdDepartamento',
                label: 'Setor',
                accessor: 'cdDepartamento',
                visible: true,
                render: (value, row) => {
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
    }
};