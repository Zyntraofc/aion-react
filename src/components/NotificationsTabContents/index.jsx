import React, { useState, useEffect } from 'react';
import { BellIcon } from "lucide-react";
import ConfigCard from "../configCard";
import ConfigSection from "../configSection";
import ToggleSwitch from "../customToggleSwitch";
import { Form } from 'react-bootstrap';
import SelectGroup from '../selectGroup';

const LOCAL_STORAGE_KEY_NOTIFICATIONS = 'configuracoesNotificacoes';

const initialNotificationTypes = [
    { id: 'nova', label: "Nova Justificativa", isEnabled: true, usesDeadline: false },
    { id: 'reincidencias', label: "Reincidência Detectada", isEnabled: false, usesDeadline: true, deadlineDays: 3 },
    { id: 'prazo', label: "Prazo Se Aproximando", isEnabled: false, usesDeadline: true, deadlineDays: 3 },
    { id: 'relatoriosMensais', label: "Relatórios Mensais", isEnabled: true, usesDeadline: false },
];

function NotificationsTabContents() {
    const [notificationTypes, setNotificationTypes] = useState(initialNotificationTypes);
    const [daysBeforeDeadline, setDaysBeforeDeadline] = useState(3);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const saveToLocalStorage = (types, deadline) => {
        const dataToSave = {
            notificationTypes: types,
            daysBeforeDeadline: deadline
        };
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFICATIONS, JSON.stringify(dataToSave));
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Erro ao salvar notificações no localStorage:", error);
        }
    };

    const handleSave = () => {
        const finalTypes = notificationTypes.map(type => {
            if (type.usesDeadline) {
                return { ...type, deadlineDays: daysBeforeDeadline };
            }
            return type;
        });

        saveToLocalStorage(finalTypes, daysBeforeDeadline);
    };

    useEffect(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFICATIONS);

        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);

                if (parsedData.notificationTypes) {
                    setNotificationTypes(parsedData.notificationTypes);
                }
                if (parsedData.daysBeforeDeadline !== undefined) {
                    setDaysBeforeDeadline(parsedData.daysBeforeDeadline);
                }
            } catch (error) {
                console.error("Erro ao carregar dados do localStorage:", error);
            }
        }
    }, []);


    useEffect(() => {

        const isInitialLoad = !localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFICATIONS);
        if (!isInitialLoad) {
            setHasUnsavedChanges(true);
        }
    }, [daysBeforeDeadline, notificationTypes]);


    const handleToggleNotification = (id) => {
        setNotificationTypes(prevTypes => {
            const updatedTypes = prevTypes.map(type =>
                type.id === id ? { ...type, isEnabled: !type.isEnabled } : type
            );
            return updatedTypes;
        });
    };

    const handleDeadlineChange = (e) => {
        const newDeadline = Number(e.target.value);
        setDaysBeforeDeadline(newDeadline);
    }


    const emailPreferences = notificationTypes.filter(type =>
        ['nova', 'reincidencias', 'prazo'].includes(type.id)
    );

    const otherPreferences = notificationTypes.filter(type =>
        ['relatoriosMensais'].includes(type.id)
    );

    return (
        <div>
            <ConfigCard
                title="Configurações de Notificações"
                description="Gerencie as preferências de notificações do sistema e seus prazos."
                icon={<BellIcon className="w-6 h-6" />}
            >
                <ConfigSection title="Notificações por Email" layout="list">
                    {emailPreferences.map(type => (
                        <div key={type.id} className="flex flex-col gap-1">
                            <ToggleSwitch
                                label={type.label}
                                checked={type.isEnabled}
                                onChange={() => handleToggleNotification(type.id)}
                            />
                        </div>
                    ))}
                </ConfigSection>

                {otherPreferences.length > 0 && (
                    <ConfigSection title="Outras Preferências" layout="list">
                        {otherPreferences.map(type => (
                            <ToggleSwitch
                                key={type.id}
                                label={type.label}
                                checked={type.isEnabled}
                                onChange={() => handleToggleNotification(type.id)}
                            />
                        ))}
                    </ConfigSection>
                )}

                <ConfigSection title="Prazos de Notificação">
                    <Form>
                        <SelectGroup label="Dias antes do prazo (para notificações urgentes)">
                            <Form.Control
                                className="p-2 border border-gray-300 rounded-lg w-full"
                                type="number"
                                min={1}
                                value={daysBeforeDeadline}
                                onChange={handleDeadlineChange}
                            />
                        </SelectGroup>
                    </Form>
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
        </div>
    );
}

export default NotificationsTabContents;