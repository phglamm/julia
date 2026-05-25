import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  MessageCircle,
  X,
  Minimize2,
  Send,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import chatService from "../../services/chatService";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: Date.now() - 1,
      sender: "assistant",
      text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const listRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const API_URL = "https://caprieux-be.onrender.com/api/chat/message";

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const send = async (evt) => {
    evt?.preventDefault();
    if (!input.trim() || isSending) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");

    const typingId = Date.now() + 1;
    setMessages((m) => [
      ...m,
      {
        id: typingId,
        sender: "assistant",
        text: "...",
        timestamp: new Date().toISOString(),
        typing: true,
      },
    ]);
    setIsSending(true);

    // Build conversation history for API
    const conversationHistory = [...messages, userMsg].map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const response = await chatService.sendMessage({
        message: userMsg.text,
        conversationHistory: conversationHistory,
      });
      const data = response.data;

      // Extract assistant reply from response
      let assistantText = null;
      if (data && data.success && data.message && data.message.content) {
        assistantText = data.message.content;
      } else if (Array.isArray(data.conversationHistory)) {
        const lastAssistant = [...data.conversationHistory]
          .reverse()
          .find((r) => r.role === "assistant");
        assistantText = lastAssistant?.content ?? null;
      }

      if (!assistantText) {
        assistantText = mockReply(userMsg.text);
      }

      // Replace typing indicator with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId
            ? { ...msg, text: assistantText, typing: false }
            : msg
        )
      );
    } catch (err) {
      console.error("Chat API error:", err);
      const errMsg =
        "Xin lỗi, đã có lỗi khi kết nối tới dịch vụ trợ lý. Vui lòng thử lại sau.";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId ? { ...msg, text: errMsg, typing: false } : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const mockReply = (text) => {
    const t = text.toLowerCase();
    if (t.includes("giá") || t.includes("bao nhiêu"))
      return "Bạn có thể xem giá sản phẩm trên trang chi tiết sản phẩm. Tôi có thể dẫn bạn đến đó nếu bạn muốn.";
    if (t.includes("thuê") || t.includes("đặt"))
      return "Bạn có thể chọn thời gian thuê khi đặt. Bạn muốn mình hướng dẫn cách thuê không?";
    if (t.includes("chào") || t.includes("xin chào"))
      return "Xin chào! Mình có thể giúp gì hôm nay?";
    return "Mình đã nhận được yêu cầu của bạn. Tôi sẵn sàng hỗ trợ bạn về sản phẩm và dịch vụ của The Caprieux.";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(e);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-r from-[#D97BA8] to-[#b8941f] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group overflow-hidden"
          >
            {/* Pulse animation */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-[#D97BA8] rounded-full"
            />

            <MessageCircle className="w-7 h-7 relative z-10" />

            {/* Notification badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
            >
              1
            </motion.div>
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden w-96 h-[600px] flex flex-col border border-[#EDD5E8]/30"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#723F53] via-[#8B6B7A] to-[#723F53] p-4 flex items-center justify-between relative overflow-hidden">
              {/* Decorative pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="bg-[#D97BA8] p-2 rounded-full"
                >
                  <Bot className="w-5 h-5 text-[#723F53]" />
                </motion.div>
                <div>
                  <h3 className="text-[#FFFFFF] font-bold text-lg">
                    AI Assistant
                  </h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[#FFFFFF]/80 text-xs">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-[#FFFFFF] hover:text-[#D97BA8] transition-colors p-2"
                >
                  <Minimize2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-[#FFFFFF] hover:text-red-400 transition-colors p-2"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-[#FFFFFF]/20 via-white to-[#FFFFFF]/20 space-y-4"
            >
              <AnimatePresence initial={false}>
                {messages.map((m, index) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 ${
                      m.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        m.sender === "assistant"
                          ? "bg-gradient-to-br from-[#D97BA8] to-[#b8941f]"
                          : "bg-gradient-to-br from-[#723F53] to-[#8B6B7A]"
                      }`}
                    >
                      {m.sender === "assistant" ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </motion.div>

                    {/* Message Bubble */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                        m.sender === "assistant"
                          ? "bg-white border border-[#EDD5E8]/30 text-[#723F53]"
                          : "bg-gradient-to-r from-[#D97BA8] to-[#b8941f] text-white"
                      }`}
                    >
                      {m.typing ? (
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{
                                y: [0, -8, 0],
                              }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                              className="w-2 h-2 bg-[#D97BA8] rounded-full"
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {m.text}
                        </p>
                      )}

                      {!m.typing && (
                        <div
                          className={`text-xs mt-1 ${
                            m.sender === "assistant"
                              ? "text-[#8B6B7A]/60"
                              : "text-white/70"
                          }`}
                        >
                          {new Date(m.timestamp).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[#EDD5E8]/30">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    rows={1}
                    className="w-full px-4 py-3 bg-gradient-to-br from-[#FFFFFF]/30 to-[#EDD5E8]/20 border-2 border-[#EDD5E8]/40 rounded-2xl focus:outline-none focus:border-[#D97BA8] transition-all text-[#723F53] placeholder-[#8B6B7A]/50 resize-none"
                    style={{ maxHeight: "120px" }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={send}
                  disabled={!input.trim() || isSending}
                  className={`p-3 rounded-xl transition-all shadow-lg ${
                    !input.trim() || isSending
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#D97BA8] to-[#b8941f] hover:shadow-xl"
                  }`}
                >
                  {isSending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>

              <div className="mt-2 text-xs text-[#8B6B7A]/60 text-center">
                Nhấn Enter để gửi, Shift + Enter để xuống dòng
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
