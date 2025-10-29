const BASE_URL = import.meta.env.VITE_API_URL;
const USER = import.meta.env.VITE_API_USER;
const PASS = import.meta.env.VITE_API_PASS;

const authHeader = 'Basic ' + btoa(`${USER}:${PASS}`);

export async function fetchWithAuth(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
}
