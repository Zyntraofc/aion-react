import React, { useState, useEffect, useCallback } from 'react';
import ConfigCard from '../configCard';
import SelectGroup from '../selectGroup';
import ToggleSwitch from '../ToggleSwitch';
import ConfigSection from '../configSection';
import { Edit, Trash2, PlusCircle, Clock, FileText, UserCheck, CheckCircle, XCircle } from 'lucide-react';

const LS_KEY_PRAZO_ENVIO = 'justificativas_prazo_envio';
const LS_KEY_PRAZO_ANALISE = 'justificativas_prazo_analise';
const LS_KEY_REQUIRES_APPROVAL = 'justificativas_requires_approval';
const LS_KEY_REQUIRES_DOC = 'justificativas_requires_doc';
const LS_KEY_JUSTIFICATIVA_TYPES = 'justificativas_types';

const loadFromLS = (key, defaultValue) => {
    try {
        const saved = localStorage.getItem(key);
        if (saved === null) return defaultValue;

        if (typeof defaultValue === 'object' || Array.isArray(defaultValue)) {
            return JSON.parse(saved);
        }

        if (typeof defaultValue === 'number') return Number(saved);
        if (typeof defaultValue === 'boolean') return saved === 'true';

        return saved;

    } catch (error) {
        console.error(`Erro ao carregar ${key} do localStorage:`, error);
        return defaultValue;
    }
};

function JustificativasTabContent() {
    const [prazoEnvio, setPrazoEnvio] = useState(() => loadFromLS(LS_KEY_PRAZO_ENVIO, 3));
    const [prazoAnalise, setPrazoAnalise] = useState(() => loadFromLS(LS_KEY_PRAZO_ANALISE, 2));
    const [requiresApproval, setRequiresApproval] = useState(() => loadFromLS(LS_KEY_REQUIRES_APPROVAL, true));
    const [requiresDoc, setRequiresDoc] = useState(() => loadFromLS(LS_KEY_REQUIRES_DOC, false));
    const [justificativaTypes, setJustificativaTypes] = useState(() => loadFromLS(LS_KEY_JUSTIFICATIVA_TYPES, [
        { id: 1, label: 'Médica', isEnabled: true },
        { id: 2, label: 'Familiar', isEnabled: false },
        { id: 3, label: 'Transporte', isEnabled: true },
    ]));

    const [newJustificativaName, setNewJustificativaName] = useState('');

    const saveToLocalStorage = useCallback((key, value) => {
        try {
            const dataToSave = typeof value === 'object' ? JSON.stringify(value) : String(value);
            localStorage.setItem(key, dataToSave);
        } catch (error) {
            console.error(`Erro ao salvar ${key} no localStorage:`, error);
        }
    }, []);

    useEffect(() => {
        saveToLocalStorage(LS_KEY_PRAZO_ENVIO, prazoEnvio);
    }, [prazoEnvio, saveToLocalStorage]);

    useEffect(() => {
        saveToLocalStorage(LS_KEY_PRAZO_ANALISE, prazoAnalise);
    }, [prazoAnalise, saveToLocalStorage]);

    useEffect(() => {
        saveToLocalStorage(LS_KEY_REQUIRES_APPROVAL, requiresApproval);
    }, [requiresApproval, saveToLocalStorage]);

    useEffect(() => {
        saveToLocalStorage(LS_KEY_REQUIRES_DOC, requiresDoc);
    }, [requiresDoc, saveToLocalStorage]);


    const handleToggleJustificativa = (id) => {
        setJustificativaTypes(prevTypes => {
            const newTypes = prevTypes.map(type =>
                type.id === id ? { ...type, isEnabled: !type.isEnabled } : type
            );
            saveToLocalStorage(LS_KEY_JUSTIFICATIVA_TYPES, newTypes);
            return newTypes;
        });
    };

    const handleRemoveJustificativa = (id) => {
        setJustificativaTypes(prevTypes => {
            const newTypes = prevTypes.filter(type => type.id !== id);
            saveToLocalStorage(LS_KEY_JUSTIFICATIVA_TYPES, newTypes);
            return newTypes;
        });
    };

    const handleAddJustificativa = () => {
        if (newJustificativaName.trim() === '') return;

        const newType = {
            id: Date.now(),
            label: newJustificativaName.trim(),
            isEnabled: true,
        };

        setJustificativaTypes(prevTypes => {
            const newTypes = [...prevTypes, newType];
            saveToLocalStorage(LS_KEY_JUSTIFICATIVA_TYPES, newTypes);
            return newTypes;
        });

        setNewJustificativaName('');
    };

    const isAddButtonDisabled = newJustificativaName.trim() === '';

    const handlePrazoEnvioChange = (e) => {
        setPrazoEnvio(Number(e.target.value));
    };

    const handlePrazoAnaliseChange = (e) => {
        setPrazoAnalise(Number(e.target.value));
    };


    return (
            <ConfigCard
                title="Configuração de Justificativas"
                description="Administre os tipos de justificativas aceitas e defina as regras de prazo e aprovação para o processo."
                icon={<Edit size={24} className="text-indigo-600" />}
                className="w-full max-w-3xl"
            >

                <ConfigSection
                    title="Prazos de Processamento"
                    description="Defina os limites de tempo para o envio da justificativa pelo funcionário e para a análise do aprovador."
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectGroup label="Prazo Máximo para Envio (dias)">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={prazoEnvio}
                                    onChange={handlePrazoEnvioChange}
                                    min="1"
                                    className="p-2 pl-10 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                    placeholder="3"
                                />
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Limite após o evento para o funcionário enviar a justificativa.</p>
                        </SelectGroup>

                        <SelectGroup label="Prazo Máximo para Análise (dias)">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={prazoAnalise}
                                    onChange={handlePrazoAnaliseChange}
                                    min="1"
                                    className="p-2 pl-10 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                    placeholder="2"
                                />
                                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Limite para o aprovador dar um retorno ao funcionário.</p>
                        </SelectGroup>
                    </div>
                </ConfigSection>

                <ConfigSection
                    title="Requisitos e Regras Gerais"
                    description="Habilite ou desabilite regras globais que se aplicam a todas as justificativas."
                    layout="list"
                >
                    <ToggleSwitch
                        label="Requer aprovação antes do registro."
                        checked={requiresApproval}
                        onChange={() => setRequiresApproval(!requiresApproval)}
                        icon={<UserCheck className="w-5 h-5 text-indigo-600" />}
                    />

                    <ToggleSwitch
                        label="Requer upload de documento (atestado/comprovante)."
                        checked={requiresDoc}
                        onChange={() => setRequiresDoc(!requiresDoc)}
                        icon={<FileText className="w-5 h-5 text-indigo-600" />}
                    />
                </ConfigSection>

                <ConfigSection
                    title="Tipos de Justificativa"
                    description="Habilite, desabilite ou remova os tipos de justificativas disponíveis."
                    layout="list"
                >
                    {justificativaTypes.map((type) => (
                        <div
                            key={type.id}
                            className={`
                                flex items-center justify-between p-3 border-b last:border-b-0 transition duration-150
                            `}
                        >
                            <div className="flex items-center flex-1 min-w-0">
                                {type.isEnabled ? (
                                    <CheckCircle className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" />
                                ) : (
                                    <XCircle className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                                )}
                                <span className={`font-medium truncate ${type.isEnabled ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                    {type.label}
                                </span>
                            </div>
                            <div className="flex items-center space-x-4 ml-4">
                                <button
                                    onClick={() => handleRemoveJustificativa(type.id)}
                                    title={`Excluir ${type.label}`}
                                    className="p-1 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <ToggleSwitch
                                    checked={type.isEnabled}
                                    onChange={() => handleToggleJustificativa(type.id)}
                                />
                            </div>
                        </div>
                    ))}
                </ConfigSection>

                <ConfigSection title="Adicionar Novo Tipo" layout="list">
                    <SelectGroup label="Nome do Novo Tipo de Justificativa">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Ex: Luto, Doação de Sangue..."
                                value={newJustificativaName}
                                onChange={(e) => setNewJustificativaName(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg flex-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                onClick={handleAddJustificativa}
                                disabled={isAddButtonDisabled}
                                className={`
                                    px-4 py-2 flex items-center gap-1 font-semibold rounded-lg shadow-md transition duration-150
                                    ${isAddButtonDisabled
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }
                                `}
                            >
                                <PlusCircle className="w-5 h-5" />
                                Adicionar
                            </button>
                        </div>
                    </SelectGroup>
                </ConfigSection>
            </ConfigCard>
    );
}

export default JustificativasTabContent;