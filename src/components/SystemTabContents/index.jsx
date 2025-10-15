import React, { useState, useEffect } from "react";
import ConfigCard from "../configCard";
import ConfigSection from "../configSection";
import SelectGroup from "../selectGroup";
import { Form } from "react-bootstrap";
import { HardDrive } from "lucide-react";
import ToggleSwitch from "../ToggleSwitch";

const LOCAL_STORAGE_KEY_SYSTEM = 'configuracoesSistema';
const initialSettings = {
    horario: "America/Brasil",
    backupAproved: false,
    logAproved: false,
};

function SystemTabContents({ Version,  LastBackup }) {
    const [settings, setSettings] = useState(initialSettings);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const { horario, backupAproved, logAproved } = settings;

    useEffect(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY_SYSTEM);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setSettings(prev => ({ ...prev, ...parsedData }));
            } catch (error) {
                console.error("Erro ao carregar configurações do sistema:", error);
            }
        }
    }, []);


    const handleSave = () => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY_SYSTEM, JSON.stringify(settings));
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Erro ao salvar no localStorage:", error);
        }
    };


    const handleChange = (e) => {
        const { id, value } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [id]: value,
        }));
        setHasUnsavedChanges(true);
    };

    const handleToggleChange = (field) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [field]: !prevSettings[field],
        }));
        setHasUnsavedChanges(true);
    };

    return (
        <ConfigCard title="Informações do Sistema" icon={<HardDrive className="w-6 h-6" />}>
            <ConfigSection title="Configurações de Fuso">
                <Form>
                    <SelectGroup label="Fuso Horário">
                        <select
                            id="horario"
                            value={horario}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded-lg w-full"
                        >
                            <option>America/Brasil</option>
                            <option>Europe/UK</option>
                            <option>America/United States</option>
                        </select>
                    </SelectGroup>
                </Form>
            </ConfigSection>

            <ConfigSection title="Backup e Segurança" layout="list">
                <ToggleSwitch
                    label="Backup Automático"
                    checked={backupAproved}
                    onChange={() => handleToggleChange('backupAproved')}
                />
                <ToggleSwitch
                    label="Log de auditoria"
                    checked={logAproved}
                    onChange={() => handleToggleChange('logAproved')}
                />
            </ConfigSection>

            <ConfigSection title="Informações do Sistema" layout="list">
                <p className="text-sm text-gray-600">Versão: {Version}</p>
                <p className="text-sm text-gray-600">Ultimo backup: {LastBackup}</p>
            </ConfigSection>

            <div className="pt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges}
                    className={`
                        px-6 py-2 font-semibold rounded-lg shadow-md transition duration-150
                        ${hasUnsavedChanges
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    Salvar Configurações
                </button>
            </div>
        </ConfigCard>
    );
}

export default SystemTabContents;