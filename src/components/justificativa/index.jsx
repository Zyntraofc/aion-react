import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, User, Calendar, FileText, CheckCircle, XCircle, Save, Loader, Clock, Building } from "lucide-react";

export default function ViewJustificationModal({
                                                   open,
                                                   onClose,
                                                   justification,
                                                   onSuccess,
                                                   mode = "view"
                                               }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [justificationData, setJustificationData] = useState(null);
    const [parecer, setParecer] = useState('');

    // Resetar estado quando o modal abrir com nova justificativa
    useEffect(() => {
        if (open && justification) {
            console.log("Modal de justificativa abrindo com:", justification);
            setJustificationData(justification);
            setParecer('');
            setError(null);
        }
    }, [open, justification]);

    // Formatar data
    const formatarData = (dataString) => {
        if (!dataString) return "Não informada";
        try {
            return new Date(dataString).toLocaleDateString('pt-BR');
        } catch (e) {
            return dataString;
        }
    };

    const formatarDataHora = (dataString) => {
        if (!dataString) return "Não informada";
        try {
            const date = new Date(dataString);
            return date.toLocaleString('pt-BR');
        } catch (e) {
            return dataString;
        }
    };

    // Funções de aprovação/recusa
    const handleApprove = async () => {
        if (!justificationData) return;

        setLoading(true);
        setError(null);

        try {
            console.log("Aprovando justificativa:", {
                justification: justificationData,
                parecer: parecer
            });

            // Simular API call - substitua pela sua implementação real
            await new Promise(resolve => setTimeout(resolve, 1000));

            onSuccess?.('approved');
            onClose();
        } catch (err) {
            console.error("Erro ao aprovar justificativa:", err);
            setError(err.response?.data?.message || "Erro ao aprovar justificativa");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!justificationData) return;

        setLoading(true);
        setError(null);

        try {
            console.log("Recusando justificativa:", {
                justification: justificationData,
                parecer: parecer
            });

            // Simular API call - substitua pela sua implementação real
            await new Promise(resolve => setTimeout(resolve, 1000));

            onSuccess?.('rejected');
            onClose();
        } catch (err) {
            console.error("Erro ao recusar justificativa:", err);
            setError(err.response?.data?.message || "Erro ao recusar justificativa");
        } finally {
            setLoading(false);
        }
    };

    const handleParecerChange = (e) => {
        setParecer(e.target.value);
    };

    if (!open || !justification) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <FileText size={24} className="text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Analisar Justificativa
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {justificationData && (
                        <div className="space-y-6">
                            {/* Cabeçalho */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Justificativa de Ausência
                                        </h1>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                justificationData.status === '1' || justificationData.status?.toLowerCase().includes('pendente')
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : justificationData.status?.toLowerCase().includes('aprovada')
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                            }`}>
                                                {justificationData.status === '1' ? 'Pendente' :
                                                    justificationData.status?.toLowerCase().includes('aprovada') ? 'Aprovada' :
                                                        justificationData.status?.toLowerCase().includes('recusada') ? 'Recusada' :
                                                            justificationData.status || 'Pendente'}
                                            </span>
                                            <span className="text-gray-600">
                                                Funcionário: {justificationData.cdFuncionario || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold">Consulta Médica</p>
                                        <p className="text-gray-600">Setor: TI</p>
                                    </div>
                                </div>
                            </div>

                            {/* Grid de informações */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Informações da Ausência */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Clock size={20} className="text-indigo-600" />
                                        Informações da Ausência
                                    </h3>

                                    <div className="space-y-3">
                                        <InfoItem
                                            icon={<User size={16} />}
                                            label="Funcionário"
                                            value={`Funcionário ${justificationData.cdFuncionario || 'N/A'}`}
                                        />

                                        <InfoItem
                                            icon={<Building size={16} />}
                                            label="Setor"
                                            value="TI"
                                        />

                                        <InfoItem
                                            icon={<Calendar size={16} />}
                                            label="Data da Falta"
                                            value={formatarData(justificationData.dataHoraBatida)}
                                        />

                                        <InfoItem
                                            icon={<Clock size={16} />}
                                            label="Horário Registrado"
                                            value={formatarDataHora(justificationData.dataHoraBatida)}
                                        />
                                    </div>
                                </div>

                                {/* Detalhes da Justificativa */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <FileText size={20} className="text-indigo-600" />
                                        Detalhes da Justificativa
                                    </h3>

                                    <div className="space-y-3">
                                        <InfoItem
                                            icon={<FileText size={16} />}
                                            label="Tipo"
                                            value="Consulta Médica"
                                        />

                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="text-indigo-600 mt-0.5">
                                                <FileText size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700">Justificativa</p>
                                                <div className="text-gray-900 mt-1 whitespace-pre-wrap">
                                                    {justificationData.justificativa || "Consulta médica de rotina agendada há 3 meses"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Parecer */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText size={20} className="text-indigo-600" />
                                    Parecer
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="text-indigo-600 mt-0.5">
                                            <FileText size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Digite seu parecer</p>
                                            <textarea
                                                rows={4}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Digite seu parecer sobre a justificativa..."
                                                value={parecer}
                                                onChange={handleParecerChange}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Este parecer será registrado no sistema e enviado ao funcionário.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {/* Botões */}
                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={loading || !parecer.trim()}
                                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader size={20} className="animate-spin" /> : <XCircle size={20} />}
                                    {loading ? "Processando..." : "Recusar"}
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={loading || !parecer.trim()}
                                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                                    {loading ? "Processando..." : "Aprovar"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// Componente auxiliar (mantido do ViewEmployeeModal)
function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-indigo-600 mt-0.5">{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <div className="text-gray-900 mt-1">{value}</div>
            </div>
        </div>
    );
}