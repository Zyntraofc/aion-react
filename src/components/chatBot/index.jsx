// Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import { Send, XIcon } from "lucide-react";

export default function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { text: "Olá! Como posso ajudar hoje?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState("");
  const chatWindowRef = useRef(null);

  const API_URL = "https://aion-chatbot-api.onrender.com/chat";
  const API_SECRET_TOKEN = "SEU_TOKEN_AQUI";

  useEffect(() => {
    let currentSessionId = sessionStorage.getItem("aion_chat_session_id");
    if (!currentSessionId) {
      currentSessionId = `react-client-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      sessionStorage.setItem("aion_chat_session_id", currentSessionId);
    }
    setSessionId(currentSessionId);
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInputValue("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_SECRET_TOKEN,
        },
        body: JSON.stringify({ user_input: userMessage, session_id: sessionId }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.output, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Erro ao contatar a API.", sender: "bot" },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  if (!isOpen) return null; // Se não estiver aberto, não renderiza nada

  return (
    <div className="fixed bottom-24 right-6 w-80 h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center gap-3 bg-indigo-600 text-white p-3">
        <img
          src="https://i.imgur.com/qv6c7Hx.jpeg"
          alt="AION AI"
          className="w-10 h-10 rounded-full border border-white/40"
        />
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg">AION AI</h2>
            <p className="text-xs opacity-90">Assistente virtual</p>
          </div>
          <button onClick={onClose} className="text-white">
            <XIcon size={20} />
          </button>
        </div>
      </div>

      <div
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`w-fit max-w-[85%] px-4 py-2 rounded-xl text-sm shadow-sm ${
              msg.sender === "user"
                ? "bg-indigo-100 self-end ml-auto"
                : "bg-white border border-gray-200"
            }`}
            dangerouslySetInnerHTML={{
              __html:
                msg.sender === "bot" ? marked.parse(msg.text) : `<p>${msg.text}</p>`,
            }}
          />
        ))}
      </div>

      <div className="flex items-center p-3 border-t bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          className="flex-1 p-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
