// contexts/HomeDataContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchHomeData, getCachedHomeData, getCachedHomeField } from '../utils/homeEndpoints.js';

const HomeDataContext = createContext();

export function useHomeData() {
    const context = useContext(HomeDataContext);
    if (!context) {
        throw new Error('useHomeData deve ser usado dentro de um HomeDataProvider');
    }
    return context;
}

export function HomeDataProvider({ children }) {
    const [homeData, setHomeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadHomeData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Tenta pegar do cache primeiro para uma resposta mais rápida
            const cachedData = getCachedHomeData();
            if (cachedData) {
                setHomeData(cachedData);
            }

            // Busca dados atualizados da API
            const freshData = await fetchHomeData();
            setHomeData(freshData);
        } catch (err) {
            console.error('❌ Erro ao carregar dados da home:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getField = (fieldName) => {
        if (!homeData) return null;
        return homeData[fieldName] || getCachedHomeField(fieldName);
    };

    useEffect(() => {
        loadHomeData();
    }, []);

    const value = {
        homeData,
        loading,
        error,
        refreshHomeData: loadHomeData,
        getField
    };

    return (
        <HomeDataContext.Provider value={value}>
            {children}
        </HomeDataContext.Provider>
    );
}