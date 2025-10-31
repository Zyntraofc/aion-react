// utils/apiConfig.js
export const API_CONFIG = {
    baseURL: "https://ms-aion-jpa.onrender.com/api/v1",
    endpoints: {
        departamentos: "/departamento/listar",
        cargos: "/cargo/listar",
        funcionarios: "/funcionario/listar",
        enderecos: "/endereco/listar",
        importExcel: "/funcionario/importar",
        inserirFuncionario: "/funcionario/inserir"
    }
};

export const getAuthHeaders = (contentType = 'application/json') => {
    const API_USER = import.meta.env.VITE_API_USER;
    const API_PASS = import.meta.env.VITE_API_PASS;
    const basicAuth = 'Basic ' + btoa(`${API_USER}:${API_PASS}`);

    const headers = {
        'Authorization': basicAuth
    };

    if (contentType) {
        headers['Content-Type'] = contentType;
    }

    return headers;
};

export const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(options.contentType),
            ...options.headers
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
    }

    return response;
};