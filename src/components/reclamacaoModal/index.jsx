import React, { useState, useEffect, useRef } from "react";
import { X, Send, ChevronDown } from "lucide-react";
import axios from "axios";

const API_PATCH = "/api/v1/reclamacao/atualizar/parcial";

const ReclamacaoChat = ({ rec, getTipoNome, onClose }) => {
  const [status, setStatus] = useState(rec.status || "E");
  const [mensagens, setMensagens] = useState([
    { autor: "colaborador", texto: rec.descricao, hora: "09:32" },
    ...(rec.resposta ? [{ autor: "rh", texto: rec.resposta, hora: "10:10" }] : []),
  ]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const [drag, setDrag] = useState(false);
  const chatRef = useRef(null);
  const scrollRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e) => {
    if (isMobile) return;
    setDrag(true);
    chatRef.current.startX = e.clientX - pos.x;
    chatRef.current.startY = e.clientY - pos.y;
  };

  const handleMouseMove = (e) => {
    if (!drag || isMobile) return;
    setPos({ x: e.clientX - chatRef.current.startX, y: e.clientY - chatRef.current.startY });
  };

  const handleMouseUp = () => setDrag(false);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [mensagens]);

  const handleStatusChange = (e) => {
    const novoStatus = e.target.value;
    setStatus(novoStatus);
    axios
      .patch(`${API_PATCH}/${rec.cdReclamacao}`, { status: novoStatus })
      .then((res) => console.log("Status atualizado:", res.data))
      .catch((err) => console.error("Erro ao atualizar status:", err));
  };

  const handleEnviar = () => {
    if (!novaMensagem.trim()) return;

    const hora = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nova = { autor: "rh", texto: novaMensagem, hora };

    setMensagens((prev) => [...prev, nova]);

    axios
      .patch(`${API_PATCH}/${rec.cdReclamacao}`, { status, resposta: novaMensagem })
      .then((res) => console.log("Resposta salva:", res.data))
      .catch((err) => console.error(err));

    setNovaMensagem("");
  };

  const canResponder = !rec.resposta;

  return (
    <div
      ref={chatRef}
      className={`fixed z-50 ${isMobile ? "inset-0 w-full h-full" : "cursor-move"}`}
      style={!isMobile ? { top: pos.y, left: pos.x } : {}}
    >
      <div
        className={`flex flex-col bg-white shadow-2xl border border-gray-100 overflow-hidden ${
          isMobile ? "w-full h-full rounded-none" : "rounded-xl w-80 md:w-96 h-[70vh]"
        }`}
      >
        <div
          className={`flex items-center justify-between bg-indigo-600 text-white px-4 py-3 shadow-lg ${
            isMobile ? "" : "cursor-grab active:cursor-grabbing rounded-t-xl"
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="truncate">
            <h3 className="text-base font-bold text-indigo-100 truncate">{rec.descricao}</h3>
            <p className="text-xs opacity-90 font-medium mt-0.5">Tipo: {getTipoNome(rec.cdTpReclamacao)}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-indigo-700 transition">
            <X size={20} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
          {mensagens.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.autor === "rh" ? "items-end" : "items-start"}`}>
              <div
                className={`px-3 py-2 rounded-xl max-w-[85%] text-sm shadow-md transition duration-300 ease-in-out ${
                  msg.autor === "rh"
                    ? "bg-indigo-500 text-white rounded-br-none hover:bg-indigo-600"
                    : "bg-white text-gray-800 rounded-tl-none border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {msg.texto}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 italic">{msg.hora}</span>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-200 bg-white flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <textarea
              placeholder="Digite sua resposta..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              rows={2}
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleEnviar())}
              disabled={!canResponder}
            />
            <button
              onClick={handleEnviar}
              className={`p-3 rounded-full text-white transition duration-150 ease-in-out shadow-md ${
                canResponder && novaMensagem.trim() ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!canResponder || !novaMensagem.trim()}
            >
              <Send size={18} />
            </button>
          </div>

          <div className="relative">
          <select
  value={status}
  onChange={handleStatusChange}
  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 shadow-sm pr-8 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-150"
>
              <option value="E">Em Andamento</option>
              <option value="A">Aberta</option>
              <option value="C">Concluída</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReclamacaoChat;
