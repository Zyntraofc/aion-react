// authFetch.js
const user = import.meta.env.VITE_API_USER;
const pass = import.meta.env.VITE_API_PASS;
const basicAuth = 'Basic ' + btoa(`${user}:${pass}`);

console.log('🔐 Configurando authFetch - User:', user ? '***' : 'undefined');
console.log('🔐 Configurando authFetch - Pass:', pass ? '***' : 'undefined');
console.log('🔐 Basic Auth gerado:', basicAuth ? '***' : 'undefined');

export async function fetchWithAuth(url, options = {}) {
    console.log('🚀 fetchWithAuth chamada para URL:', url);
    console.log('🔐 Headers sendo enviados:', {
        'Authorization': basicAuth ? '***' : 'MISSING!',
        'Content-Type': 'application/json',
        ...options.headers
    });

    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': basicAuth,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    console.log('📥 Resposta recebida - Status:', response.status, response.statusText);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText || response.statusText);
        throw new Error(errorText || response.statusText);
    }

    return response;
}