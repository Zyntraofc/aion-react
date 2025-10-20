import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, Check } from "lucide-react";

const API_INSERIR = "https://ms-aion-mongodb.onrender.com/api/v1/notificacao/inserir";
const API_LISTAR = "https://ms-aion-mongodb.onrender.com/api/v1/notificacao/listar";
const API_REMOVER = "https://ms-aion-mongodb.onrender.com/api/v1/notificacao/remover";
const API_ATUALIZAR = "https://ms-aion-mongodb.onrender.com/api/v1/notificacao/atualizar";

function NotificationsCard() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [novaNotificacao, setNovaNotificacao] = useState({
    titulo: "",
    descricao: "",
    funcionarioDestino: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editNotificacao, setEditNotificacao] = useState({});

  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const res = await fetch(API_LISTAR);
        const data = await res.json();
        setNotificacoes(data);
      } catch (err) {
        console.error("Erro ao listar notificações:", err);
      }
    };
    fetchNotificacoes();
  }, []);

  const handleAdicionar = async () => {
    if (!novaNotificacao.titulo.trim() || !novaNotificacao.descricao.trim()) return;

    const nova = {
      cdFuncionario: Number(novaNotificacao.funcionarioDestino),
      titulo: novaNotificacao.titulo,
      descricao: novaNotificacao.descricao,
      data: new Date().toISOString()
    };

    try {
      const res = await fetch(API_INSERIR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nova)
      });

      if (!res.ok) throw new Error(await res.text());

      const saved = await res.json();
      setNotificacoes([...notificacoes, saved]);
      setNovaNotificacao({ titulo: "", descricao: "", funcionarioDestino: "" });
    } catch (err) {
      console.error("Erro ao enviar notificação:", err);
      alert("Não foi possível enviar a notificação. Tente novamente.");
    }
  };

  const handleRemover = async (cdNotificacao) => {
    if (!window.confirm("Tem certeza que deseja remover esta notificação?")) return;

    try {
      const res = await fetch(`${API_REMOVER}/${cdNotificacao}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error(await res.text());

      setNotificacoes(notificacoes.filter(n => n.cdNotificacao !== cdNotificacao));
    } catch (err) {
      console.error("Erro ao remover notificação:", err);
      alert("Não foi possível remover a notificação.");
    }
  };

  const handleEditar = (index) => {
    setEditIndex(index);
    setEditNotificacao({ ...notificacoes[index] });
  };

  const handleSalvarEdicao = async (index) => {
    const not = editNotificacao;
    try {
      const res = await fetch(`${API_ATUALIZAR}/${not.cdNotificacao}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(not)
      });
      if (!res.ok) throw new Error(await res.text());

      const listaAtualizada = [...notificacoes];
      listaAtualizada[index] = not;
      setNotificacoes(listaAtualizada);
      setEditIndex(null);
      setEditNotificacao({});
    } catch (err) {
      console.error("Erro ao atualizar notificação:", err);
      alert("Não foi possível atualizar a notificação.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaNotificacao({ ...novaNotificacao, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditNotificacao({ ...editNotificacao, [name]: value });
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <PlusCircle className="text-indigo-600 w-6 h-6" />
        Adicionar Notificação
      </h2>

      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          name="titulo"
          value={novaNotificacao.titulo}
          onChange={handleChange}
          placeholder="Título da notificação"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <textarea
          name="descricao"
          value={novaNotificacao.descricao}
          onChange={handleChange}
          placeholder="Descrição da notificação"
          className="border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          name="funcionarioDestino"
          value={novaNotificacao.funcionarioDestino}
          onChange={handleChange}
          placeholder="ID do funcionário"
          className="border border-gray-300 rounded-lg px-3 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleAdicionar}
          className="bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-2"
        >
          Adicionar Notificação
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Notificações cadastradas</h3>
      {notificacoes.length === 0 ? (
        <p className="text-gray-500">Nenhuma notificação cadastrada.</p>
      ) : (
        <ul className="space-y-3">
          {notificacoes.map((not, index) => (
            <li
              key={not.cdNotificacao}
              className="border border-gray-300 rounded-lg p-3 flex flex-col gap-2 bg-gray-50"
            >
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    name="titulo"
                    value={editNotificacao.titulo}
                    onChange={handleEditChange}
                    className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <textarea
                    name="descricao"
                    value={editNotificacao.descricao}
                    onChange={handleEditChange}
                    className="border border-gray-300 rounded-lg px-2 py-1 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <input
                    type="number"
                    name="cdFuncionario"
                    value={editNotificacao.cdFuncionario}
                    onChange={handleEditChange}
                    className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleSalvarEdicao(index)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                    >
                      <Check size={16} /> Salvar
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{not.titulo}</p>
                    <p className="text-gray-700">{not.descricao}</p>
                    <p className="text-gray-500 text-sm">Funcionário: {not.cdFuncionario}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(index)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleRemover(not.cdNotificacao)}
                      className="text-red-600 hover:text-red-800"
                      title="Remover"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsCard;
