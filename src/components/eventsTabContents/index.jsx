import React, { useState, useEffect } from 'react';
import ConfigCard from '../configCard';
import ConfigSection from '../configSection';
import SelectGroup from '../selectGroup';
import { PlusCircle, Trash2, Calendar, Link, Edit3, Check, X } from 'lucide-react';
import axios from 'axios';

const API_URL_INSERT = 'https://ms-aion-mongodb.onrender.com/api/v1/evento/inserir';
const API_URL_LIST = 'https://ms-aion-mongodb.onrender.com/api/v1/evento/listar';
const API_URL_DELETE = 'https://ms-aion-mongodb.onrender.com/api/v1/evento/remover';
const API_URL_UPDATE = 'https://ms-aion-mongodb.onrender.com/api/v1/evento/atualizar';

function EventsTabContent() {
    const [eventos, setEventos] = useState([]);
    const [novoEvento, setNovoEvento] = useState({ data: '', titulo: '', descricao: '', uri: '' });
    const [editando, setEditando] = useState(null);
    const [editEvento, setEditEvento] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const CD_EMPRESA = 1;

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_URL_LIST);
                setEventos(response.data || []);
            } catch (err) {
                console.error(err);
                setError('Não foi possível carregar os eventos.');
            } finally {
                setLoading(false);
            }
        };
        fetchEventos();
    }, []);

    useEffect(() => {
        const { data, titulo, descricao } = novoEvento;
        setIsFormValid(data.trim() !== '' && titulo.trim().length >= 3 && descricao.trim().length >= 10);
    }, [novoEvento]);

    const handleNovoEventoChange = (e) => {
        const { id, value } = e.target;
        setNovoEvento((prev) => ({ ...prev, [id]: value }));
    };

    const handleAddEvento = async () => {
        if (!isFormValid) return;

        try {
            const payload = {
                cdEmpresa: CD_EMPRESA,
                titulo: novoEvento.titulo.trim(),
                descricao: novoEvento.descricao.trim(),
                ...(novoEvento.uri && { uri: novoEvento.uri.trim() }),
                data: novoEvento.data ? new Date(novoEvento.data).toISOString() : undefined,
            };

            const response = await axios.post(API_URL_INSERT, payload);
            setEventos((prev) => [...prev, response.data]);
            setNovoEvento({ data: '', titulo: '', descricao: '', uri: '' });
        } catch (err) {
            console.error(err);
            setError('Não foi possível adicionar o evento.');
        }
    };

    const handleRemoveEvento = async (cdEvento) => {
        if (!window.confirm('Deseja realmente remover este evento?')) return;
        try {
            await axios.delete(`${API_URL_DELETE}/${cdEvento}`);
            setEventos((prev) => prev.filter((e) => e.cdEvento !== cdEvento));
        } catch (err) {
            console.error(err);
            setError('Não foi possível remover o evento.');
        }
    };

    const handleEditClick = (evento) => {
        setEditando(evento.cdEvento);
        setEditEvento({
            titulo: evento.titulo,
            descricao: evento.descricao,
            uri: evento.uri || '',
            data: evento.data ? evento.data.slice(0, 16) : '',
        });
    };

    const handleEditChange = (e) => {
        const { id, value } = e.target;
        setEditEvento((prev) => ({ ...prev, [id]: value }));
    };

    const handleSaveEdit = async (cdEvento) => {
        try {
            const payload = {
                cdEvento,
                ...editEvento,
                data: editEvento.data ? new Date(editEvento.data).toISOString() : undefined,
            };
            const response = await axios.patch(`${API_URL_UPDATE}/${cdEvento}`, payload);
            setEventos((prev) => prev.map((e) => (e.cdEvento === cdEvento ? response.data : e)));
            setEditando(null);
        } catch (err) {
            console.error(err);
            setError('Erro ao atualizar o evento.');
        }
    };

    const formatEventDate = (datetime) => {
        if (!datetime) return 'N/A';
        try {
            const date = new Date(datetime);
            return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        } catch {
            return datetime;
        }
    };

    return (
        <ConfigCard
            title="Agenda de Eventos"
            description="Gerencie os próximos eventos, treinamentos e comunicados importantes."
            icon={<Calendar className="w-6 h-6" />}
        >
            <ConfigSection title="Adicionar Novo Evento" layout="list">
                <div className="space-y-4">
                    <SelectGroup label="Data e Hora do Evento">
                        <input
                            id="data"
                            type="datetime-local"
                            value={novoEvento.data}
                            onChange={handleNovoEventoChange}
                            className="p-3 border border-gray-300 rounded-lg w-full text-gray-700"
                        />
                    </SelectGroup>

                    <SelectGroup label="Título">
                        <input
                            id="titulo"
                            type="text"
                            placeholder="Ex: Treinamento de Segurança"
                            value={novoEvento.titulo}
                            onChange={handleNovoEventoChange}
                            className="p-3 border border-gray-300 rounded-lg w-full text-gray-700"
                        />
                    </SelectGroup>

                    <SelectGroup label="Descrição do Evento">
            <textarea
                id="descricao"
                rows="3"
                placeholder="Detalhes do evento, local e participantes"
                value={novoEvento.descricao}
                onChange={handleNovoEventoChange}
                className="p-3 border border-gray-300 rounded-lg w-full resize-none text-gray-700"
            />
                    </SelectGroup>

                    <SelectGroup label="Imagem (URL - Opcional)">
                        <div className="flex flex-col md:flex-row items-stretch gap-3 w-full">
                            <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-3">
                                <Link className="w-5 h-5 text-gray-500 mr-2" />
                                <input
                                    id="uri"
                                    type="url"
                                    placeholder="https://link-imagem.com (Opcional)"
                                    value={novoEvento.uri}
                                    onChange={handleNovoEventoChange}
                                    className="p-2 w-full outline-none text-gray-700"
                                />
                            </div>

                            <button
                                onClick={handleAddEvento}
                                disabled={!isFormValid}
                                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold shadow-md transition duration-150 ${
                                    isFormValid ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                <PlusCircle className="w-5 h-5" /> Adicionar
                            </button>
                        </div>
                    </SelectGroup>
                </div>
            </ConfigSection>

            <ConfigSection title="Eventos Cadastrados" layout="list">
                {loading ? (
                    <p>Carregando eventos...</p>
                ) : eventos.length === 0 ? (
                    <p className="text-gray-500">Nenhum evento cadastrado.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {eventos.map((evento) => (
                            <div
                                key={evento.cdEvento}
                                className="bg-white shadow rounded-lg border border-gray-200 p-4 flex flex-col"
                            >
                                {editando === evento.cdEvento ? (
                                    <>
                                        <input
                                            id="titulo"
                                            type="text"
                                            value={editEvento.titulo}
                                            onChange={handleEditChange}
                                            className="border rounded p-2 w-full"
                                        />
                                        <textarea
                                            id="descricao"
                                            rows="2"
                                            value={editEvento.descricao}
                                            onChange={handleEditChange}
                                            className="border rounded p-2 w-full mt-2"
                                        />
                                        <input
                                            id="data"
                                            type="datetime-local"
                                            value={editEvento.data}
                                            onChange={handleEditChange}
                                            className="border rounded p-2 w-full mt-2"
                                        />
                                        <input
                                            id="uri"
                                            type="url"
                                            placeholder="Imagem URL"
                                            value={editEvento.uri}
                                            onChange={handleEditChange}
                                            className="border rounded p-2 w-full mt-2"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleSaveEdit(evento.cdEvento)}
                                                className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                                            >
                                                <Check size={16} /> Salvar
                                            </button>
                                            <button
                                                onClick={() => setEditando(null)}
                                                className="flex items-center gap-1 bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500"
                                            >
                                                <X size={16} /> Cancelar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-semibold text-lg text-gray-800">{evento.titulo}</h3>
                                        <p className="text-gray-600">{evento.descricao}</p>
                                        <p className="text-sm text-gray-500">{formatEventDate(evento.data)}</p>
                                        {evento.uri && (
                                            <img
                                                src={evento.uri}
                                                alt={evento.titulo}
                                                className="mt-2 w-full h-40 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => handleEditClick(evento)}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit3 size={16} /> Editar
                                            </button>
                                            <button
                                                onClick={() => handleRemoveEvento(evento.cdEvento)}
                                                className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} /> Remover
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ConfigSection>

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </ConfigCard>
    );
}

export default EventsTabContent;