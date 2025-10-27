import React, { useState, useEffect } from 'react';
import ConfigCard from '../configCard/index.jsx';
import { Settings, Clock, Building2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'configuracoesGeraisEmpresa';
const CNPJ_REGEX = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;

function ConfiguracoesGeraisTabContent() {
    const initialData = {
        nomeEmpresa: 'Aion Soluções',
        cnpj: '12.345.678/0001-90',
        endereco: 'Rua das Flores, 123',
        horaEntrada: '08:00',
        horaSaida: '18:00',
    };

    const [config, setConfig] = useState(initialData);
    const [cnpjError, setCnpjError] = useState('');

    useEffect(() => {
        const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedConfig) {
            try {
                setConfig(JSON.parse(savedConfig));
            } catch (error) {
                console.error("Erro ao carregar configurações do localStorage:", error);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        }
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setConfig(prevConfig => ({
            ...prevConfig,
            [id]: value,
        }));

        if (id === 'cnpj' && cnpjError) {
            setCnpjError('');
        }
    };


    const handleSave = () => {
        if (!CNPJ_REGEX.test(config.cnpj)) {
            setCnpjError('Formato de CNPJ inválido. Use 99.999.999/0001-99 ou apenas 14 dígitos.');
            return;
        }
        setCnpjError('');
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
        } catch (error) {
            console.error("Erro ao salvar no localStorage:", error);
        }

        console.log('Dados salvos (via localStorage):', config);
    };

    return (
        <ConfigCard
            title={"Configurações Gerais"}
            icon={<Settings className="w-6 h-6" />}
        >
            <div className="space-y-6">

                <h3 className="text-xl font-semibold text-gray-700 flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>Dados da Empresa</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="nomeEmpresa" className="text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                        <input
                            type="text"
                            id="nomeEmpresa"
                            value={config.nomeEmpresa}
                            onChange={handleChange}
                            placeholder="Nome Completo da Empresa"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="cnpj" className="text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                        <input
                            type="text"
                            id="cnpj"
                            value={config.cnpj}
                            onChange={handleChange}
                            placeholder="00.000.000/0000-00"
                            pattern={CNPJ_REGEX.source}
                            title="Formato CNPJ inválido. Ex: 99.999.999/0001-99 ou 14 dígitos."
                            className={`p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${cnpjError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {cnpjError && (
                            <p className="mt-1 text-sm text-red-500">{cnpjError}</p>
                        )}
                    </div>

                    <div className="md:col-span-2 flex flex-col">
                        <label htmlFor="endereco" className="text-sm font-medium text-gray-700 mb-1">Endereço</label>
                        <input
                            type="text"
                            id="endereco"
                            value={config.endereco}
                            onChange={handleChange}
                            placeholder="Rua, número, cidade..."
                            className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6"></div>

                <h3 className="text-xl font-semibold text-gray-700 flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <span>Horário Padrão</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="horaEntrada" className="text-sm font-medium text-gray-700 mb-1">Entrada</label>
                        <input
                            type="time"
                            id="horaEntrada"
                            value={config.horaEntrada}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="horaSaida" className="text-sm font-medium text-gray-700 mb-1">Saída</label>
                        <input
                            type="time"
                            id="horaSaida"
                            value={config.horaSaida}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
                    >
                        Salvar Configurações
                    </button>
                </div>

            </div>
        </ConfigCard>
    );
}

export default ConfiguracoesGeraisTabContent;