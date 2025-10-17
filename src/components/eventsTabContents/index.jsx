import React, { useState, useEffect } from 'react';
import ConfigCard from '../configCard';
import ConfigSection from '../configSection';
import SelectGroup from '../selectGroup';
import { PlusCircle, Trash2, Calendar, Link } from 'lucide-react';
import axios from 'axios';

const API_URL_INSERT = 'https://ms-aion-mongodb.onrender.com/api/v1/evento/inserir';
const API_URL_LIST = 'https://ms-aion-mongodb.onrender.com/api/v1/evento/listar';
const API_URL_DELETE = 'https://ms-aion-mongodb.onrender.com/api/v1/evento/remover'; // se tiver delete no backend

function EventsTabContent() {
    const [eventos, setEventos] = useState([]);
    const [novoEvento, setNovoEvento] = useState({
        data: '',
        titulo: '',
        descricao: '',
        uri: '',
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const CD_EMPRESA = 1; // Substitua pelo ID real da empresa

    // Carregar eventos do backend
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_URL_LIST);
                setEventos(response.data || []);
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar os eventos.");
            } finally {
                setLoading(false);
            }
        };
        fetchEventos();
    }, []);

    // Validação do formulário
    useEffect(() => {
        const { data, titulo, descricao } = novoEvento;
        setIsFormValid(
            data.trim() !== '' &&
            titulo.trim().length >= 3 &&
            descricao.trim().length >= 10
        );
    }, [novoEvento]);

    const handleNovoEventoChange = (e) => {
        const { id, value } = e.target;
        setNovoEvento(prev => ({ ...prev, [id]: value }));
    };

    const handleAddEvento = async () => {
        if (!isFormValid) return;

        try {
            const payload = {
                cdEmpresa: CD_EMPRESA,
                titulo: novoEvento.titulo,
                descricao: novoEvento.descricao,
                uri: novoEvento.uri || null,
                data: novoEvento.data ? novoEvento.data + ':00' : null, // adiciona segundos
            };

            const response = await axios.post(API_URL_INSERT, payload);

            setEventos(prev => [...prev, response.data]);
            setNovoEvento({ data: '', titulo: '', descricao: '', uri: '' });
        } catch (err) {
            console.error(err);
            setError("Não foi possível adicionar o evento.");
        }
    };

    const handleRemoveEvento = async (cdEvento) => {
        try {
           await axios.delete(`${API_URL_DELETE}/${cdEvento}`);
            setEventos(prev => prev.filter(e => e.cdEvento !== cdEvento));
        } catch (err) {
            console.error(err);
            setError("Não foi possível remover o evento.");
        }
    };

    const formatEventDate = (datetime) => {
        if (!datetime) return 'N/A';
        try {
            const date = new Date(datetime);
            return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        } catch (e) {
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
                            placeholder="Detalhes do evento, local e quem deve participar."
                            value={novoEvento.descricao}
                            onChange={handleNovoEventoChange}
                            className="p-3 border border-gray-300 rounded-lg w-full resize-none text-gray-700"
                        />
                    </SelectGroup>

                    <SelectGroup label="Imagem de evento (URL - Opcional)">
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
                                className={`
                                    flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold shadow-md transition duration-150
                                    ${isFormValid
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                `}
                            >
                                <PlusCircle className="w-5 h-5" />
                                Adicionar
                            </button>
                        </div>
                    </SelectGroup>
                </div>
            </ConfigSection>

            <ConfigSection title="Próximos Eventos Cadastrados">
                {loading ? (
                    <p className="text-gray-500 italic">Carregando eventos...</p>
                ) : eventos.length === 0 ? (
                    <p className="text-gray-500 italic">Nenhum evento cadastrado.</p>
                ) : (
                    <div className="space-y-4">
                        {eventos.map((evento) => (
                            <div key={evento.cdEvento} className="p-4 border rounded-lg shadow-sm flex justify-between items-start hover:bg-gray-50 transition">
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800">{evento.titulo}</h4>
                                    <p className="text-sm text-indigo-600 mb-1">
                                        <Calendar className="inline-block w-5 h-5 mr-1 align-text-bottom" />
                                        {formatEventDate(evento.data)}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{evento.descricao}</p>
                                    {evento.uri && (
                                        <img
                                            src={evento.uri}
                                            alt={evento.titulo}
                                            className="w-full max-h-40 object-cover mt-2 rounded-lg"
                                        />
                                    )}
                                </div>
                                <button
                                    onClick={() => handleRemoveEvento(evento.cdEvento)}
                                    className="p-2 ml-4 text-red-500 hover:text-red-700 transition"
                                    title="Remover Evento"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
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
