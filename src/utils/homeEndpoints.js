import { registry } from './registry.js';

// Prefixo para as chaves do localStorage
const HOME_DATA_PREFIX = 'homeData_';

export async function fetchHomeData() {
    console.log('🔄 Buscando dados para a home via registry...');

    try {
        // Usa a função do registry para buscar os dados
        const data = await registry.home.fetchData();
        console.log('📊 Dados da home recebidos:', data);

        // Armazena cada campo individualmente no localStorage
        Object.entries(data).forEach(([key, value]) => {
            const storageKey = `${HOME_DATA_PREFIX}${key}`;
            localStorage.setItem(storageKey, JSON.stringify(value));
        });

        // Mantém também o objeto completo para compatibilidade
        localStorage.setItem('homeData', JSON.stringify(data));

        console.log('💾 Dados da home armazenados individualmente no localStorage.');
        return data;
    } catch (error) {
        console.error('❌ Erro ao buscar dados da home:', error);
        return null;
    }
}

// Função para obter dados do cache (mantida para compatibilidade)
export function getCachedHomeData() {
    try {
        const cached = localStorage.getItem('homeData');
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error('❌ Erro ao recuperar dados do cache:', error);
        return null;
    }
}

// Função para obter um campo específico do cache
export function getCachedHomeField(fieldName) {
    try {
        const storageKey = `${HOME_DATA_PREFIX}${fieldName}`;
        const cached = localStorage.getItem(storageKey);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error(`❌ Erro ao recuperar campo ${fieldName} do cache:`, error);
        return null;
    }
}

// Função para obter todos os campos armazenados individualmente
export function getAllCachedHomeFields() {
    try {
        const result = {};
        const keys = Object.keys(localStorage);

        keys.forEach(key => {
            if (key.startsWith(HOME_DATA_PREFIX)) {
                const fieldName = key.replace(HOME_DATA_PREFIX, '');
                result[fieldName] = JSON.parse(localStorage.getItem(key));
            }
        });

        return result;
    } catch (error) {
        console.error('❌ Erro ao recuperar todos os campos do cache:', error);
        return {};
    }
}

// Função para limpar cache completo
export function clearHomeCache() {
    // Remove o objeto completo
    localStorage.removeItem('homeData');

    // Remove todos os campos individuais
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith(HOME_DATA_PREFIX)) {
            localStorage.removeItem(key);
        }
    });
}