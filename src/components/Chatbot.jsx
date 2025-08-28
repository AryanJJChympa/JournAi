import React, { useState, useRef, useEffect } from "react";
import { Menu, X, SendHorizontal, Bot, User, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { sendChatMessage } from "../gemini/gemini";

const LOCAL_STORAGE_HISTORY_KEY = "journ_chat_history";
const LOCAL_STORAGE_MESSAGES_KEY = "journ_current_messages";

const Chatbot = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { id: crypto.randomUUID(), role: "model", text: "Hello! I’m Ember 🌿 How are you feeling today?" },
  ]);
  const [chatHistory, setChatHistory] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);



  const messagesEndRef = useRef(null);

  /** Helper: default bot message */
  const getDefaultBotMessage = () => ({
    id: crypto.randomUUID(),
    role: "model",
    text: "Hello! I’m Ember 🌿 How are you feeling today?",
  });

  /** Clean AI responses */
  const cleanResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
      .replace(/#{1,6}\s?/g, "")
      .replace(/\*/g, "")
      .replace(/[_~]/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  /** Load messages + history */
  useEffect(() => {
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    const storedMessages = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);

    if (storedHistory) setChatHistory(JSON.parse(storedHistory));
    if (storedMessages) {
      const parsedMessages = JSON.parse(storedMessages).map((msg) => ({
        ...msg,
        id: msg.id || crypto.randomUUID(),
      }));
      setChatMessages(parsedMessages);
    }
  }, []);

  /** Save chat history */
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  /** Save current messages */
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(chatMessages));
  }, [chatMessages]);

  /** Auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  /** Toggle sidebar */
  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  /** Send message */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;

    const userMessage = { id: crypto.randomUUID(), role: "user", text: messageInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setMessageInput("");
    setIsTyping(true);

    try {
      const geminiResponse = await sendChatMessage(messageInput);
      const cleanedText = cleanResponse(geminiResponse);

      const modelMessage = { id: crypto.randomUUID(), role: "model", text: cleanedText };
      setChatMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setChatMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "model", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /** New Chat */
  const handleNewChat = () => {
    if (chatMessages.some((msg) => msg.role === "user")) {
      const newHistoryItem = {
        title: chatMessages.find((m) => m.role === "user")?.text.slice(0, 30) || "Untitled",
        fullConversation: chatMessages.map(msg => ({ ...msg })), // deep copy
        timestamp: Date.now(),
      };
      setChatHistory((prev) => [...prev, newHistoryItem]);
    }

    setChatMessages([getDefaultBotMessage()]);
    setMessageInput("");
  };

  /** Clear single chat */
  const handleClearSingleChat = (timestamp) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmDelete) return;

    const updatedHistory = chatHistory.filter((chat) => chat.timestamp !== timestamp);
    setChatHistory(updatedHistory);

    const selectedChat = chatHistory.find((chat) => chat.timestamp === timestamp);
    if (selectedChat && selectedChat.fullConversation === chatMessages) {
      setChatMessages([getDefaultBotMessage()]);
    }
  };

  /** Clear all chats */
  const handleClearAllChats = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all Chat History?");
    if (confirmClear) {
      setChatMessages([getDefaultBotMessage()]);
      setChatHistory([]);
      localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
      localStorage.removeItem(LOCAL_STORAGE_MESSAGES_KEY);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2e] to-[#121212] text-gray-200 font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={{ width: "14rem" }}
        animate={{ width: isSidebarOpen ? "14rem" : "4rem" }}
        transition={{ duration: 0.3 }}
        className="relative z-20 flex-shrink-0 flex flex-col h-full bg-[#111122]/80 backdrop-blur-lg border-r border-white/10 shadow-xl"
      >
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
              >
                Journ AI
              </motion.h2>
            )}
          </AnimatePresence>
          <motion.button
            onClick={handleToggleSidebar}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-800/60 hover:text-white transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-grow overflow-y-auto">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.nav
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 space-y-2"
              >
                {/* New Chat */}
                <button
                  onClick={handleNewChat}
                  className="flex items-center p-3 rounded-lg border border-white/10 bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md hover:opacity-90 transition-all duration-300 w-full"
                >
                  <span className="ml-3 font-medium">+ New Chat</span>
                </button>

                {/* Chat History */}
                {chatHistory.length === 0 ? (
                  <p className="text-sm text-gray-400 px-5 mt-4 text-center border border-white/10 rounded-md py-2">
                    No chats yet..
                  </p>
                ) : (
                  chatHistory.map((item) => (
                    <div
                      key={item.timestamp}
                      className="flex items-center justify-between bg-gray-800/50 border border-white/5 rounded-lg hover:bg-gray-700/50 transition p-2"
                    >
                      <button
                        onClick={() => {
                          const restoredMessages = item.fullConversation.map((msg) => ({
                            ...msg,
                            id: msg.id || crypto.randomUUID(),
                          }));
                          setChatMessages(restoredMessages);
                          setMessageInput("");
                        }}
                        className="flex-1 text-left truncate"
                      >
                        {item.title}
                      </button>
                      <Trash2
                        size={18}
                        className="ml-2 cursor-pointer text-gray-400 hover:text-red-500 transition"
                        onClick={() => handleClearSingleChat(item.timestamp)}
                      />
                    </div>
                  ))
                )}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        {/* Clear Chats */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-white/10">
            <motion.button
              onClick={handleClearAllChats}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full text-lg h-10 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 transition"
            >
              Clear All Chats
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full relative">
        <header className="flex-shrink-0 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/10 shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Share your thoughts with Ember 🌿
          </h1>
        </header>

        {/* Chat Messages */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
  <AnimatePresence>
    {chatMessages.map((msg) => (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-start gap-3 p-4 rounded-xl ${msg.role === "user" ? "justify-end" : ""}`}
      >
        {msg.role === "model" && <Bot size={24} className="text-purple-400 mt-1" />}
        <div
          className={`p-3 rounded-2xl shadow-md whitespace-pre-line ${
            msg.role === "user"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none"
              : "bg-gray-800/60 backdrop-blur-md border border-white/10 text-gray-200 rounded-bl-none"
          }`}
        >
          {msg.text}
        </div>
        {msg.role === "user" && <User size={24} className="text-pink-400 mt-1" />}
      </motion.div>
    ))}

    {/* TYPING INDICATOR SEPARATE */}
    {isTyping && (
      <motion.div
        key="typing-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/60 backdrop-blur-md border border-white/10 text-gray-300 shadow-md w-fit"
      >
        <Bot size={20} className="text-purple-400" />
        <p className="text-sm italic">Ember is typing...</p>
      </motion.div>
    )}

    <div ref={messagesEndRef} />
  </AnimatePresence>
</div>

        {/* Input Box */}
        <div className="flex-shrink-0 py-3 px-3 bg-[#1a1a2e]/80 backdrop-blur-md border-t border-white/10">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 resize-none p-3 rounded-xl border border-white/10 bg-gray-900/80 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="Message Ember..."
              rows="1"
              disabled={isTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <motion.button
              type="submit"
              disabled={isTyping}
              className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              whileHover={{ scale: isTyping ? 1 : 1.05 }}
              whileTap={{ scale: isTyping ? 1 : 0.95 }}
            >
              <SendHorizontal size={24} />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
