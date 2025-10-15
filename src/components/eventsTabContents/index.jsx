import React, { useState, useEffect } from 'react';
import ConfigCard from '../configCard';
import ConfigSection from '../configSection';
import FormGroup from '../FormGroup';
import { PlusCircle, Trash2, Calendar, Link } from 'lucide-react';

const LOCAL_STORAGE_KEY_EVENTOS = 'listaDeEventos';

function EventsTabContent() {
    const [eventos, setEventos] = useState([]);
    const [novoEvento, setNovoEvento] = useState({
        data: '',
        titulo: '',
        descricao: '',
        uri: '',
    });
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const savedEvents = localStorage.getItem(LOCAL_STORAGE_KEY_EVENTOS);
        if (savedEvents) {
            try {
                setEventos(JSON.parse(savedEvents));
            } catch (error) {
                console.error("Erro ao carregar eventos do localStorage:", error);
            }
        }
    }, []);

    useEffect(() => {
        const { data, titulo, descricao } = novoEvento;
        setIsFormValid(data.trim() !== '' && titulo.trim().length >= 3 && descricao.trim().length >= 10);
    }, [novoEvento]);

    const handleNovoEventoChange = (e) => {
        const { id, value } = e.target;
        setNovoEvento(prev => ({ ...prev, [id]: value }));
    };

    const handleAddEvento = () => {
        if (!isFormValid) return;

        const novo = {
            cdEvento: Date.now().toString(),
            ...novoEvento,
            uri: novoEvento.uri.trim(),
        };

        const updatedEvents = [...eventos, novo];
        setEventos(updatedEvents);
        localStorage.setItem(LOCAL_STORAGE_KEY_EVENTOS, JSON.stringify(updatedEvents));

        setNovoEvento({ data: '', titulo: '', descricao: '', uri: '' });
    };

    const handleRemoveEvento = (cdEvento) => {
        const updatedEvents = eventos.filter(evento => evento.cdEvento !== cdEvento);
        setEventos(updatedEvents);
        localStorage.setItem(LOCAL_STORAGE_KEY_EVENTOS, JSON.stringify(updatedEvents));
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
                    <FormGroup label="Data e Hora do Evento">
                        <input
                            id="data"
                            type="datetime-local"
                            value={novoEvento.data}
                            onChange={handleNovoEventoChange}
                            className="p-3 border border-gray-300 rounded-lg w-full text-gray-700"
                        />
                    </FormGroup>

                    <FormGroup label="Título">
                        <input
                            id="titulo"
                            type="text"
                            placeholder="Ex: Treinamento de Segurança"
                            value={novoEvento.titulo}
                            onChange={handleNovoEventoChange}
                            className="p-3 border border-gray-300 rounded-lg w-full text-gray-700"
                        />
                    </FormGroup>

                    <FormGroup label="Descrição do Evento">
                        <textarea
                            id="descricao"
                            rows="3"
                            placeholder="Detalhes do evento, local e quem deve participar."
                            value={novoEvento.descricao}
                            onChange={handleNovoEventoChange}
                            className="p-3 border border-gray-300 rounded-lg w-full resize-none text-gray-700"
                        />
                    </FormGroup>

                    <FormGroup label="Imagem de evento (URL - Opcional)">
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
                    </FormGroup>
                </div>
            </ConfigSection>

            <ConfigSection title="Próximos Eventos Cadastrados">
                {eventos.length === 0 ? (
                    <p className="text-gray-500 italic">Nenhum evento cadastrado. Use o formulário acima para adicionar.</p>
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
        </ConfigCard>
    );
}

export default EventsTabContent;
