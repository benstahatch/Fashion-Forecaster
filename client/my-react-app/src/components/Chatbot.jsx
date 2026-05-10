import React, { useState, useEffect, useRef } from 'react';

/**
 * Chatbot Component
 * Design Philosophy: High-End Minimalist / Luxury Editorial.
 * Features: 
 * - Automated Pinterest redirection for future/gap queries.
 * - Deep-folder CSV data integration.
 * - Sanitized typography (Auto-strips Markdown).
 * - Clickable "Visual Research" links for Pinterest searches.
 */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  
  // INITIAL STATE: Clean, professional welcome.
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Welcome to the Fashion Forecasting Intelligence portal. Our analysis of current Zara datasets is complete. How can I assist your research today?" 
    }
  ]);

  // Updated Suggestion Chips: Strategic queries the AI can answer with data.
  const suggestions = [
    "Formal vs Casual Analysis",
    "Men's Market Leadership",
    "Zara Origins Strategy"
  ];

  // Auto-scroll logic to stay at the bottom of the conversation.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async (userText) => {
    const messageContent = userText || input;
    if (!messageContent.trim()) return;

    const userMsg = { role: "user", content: messageContent };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.content || data.error || "Server error");
      }

      const aiResponse = data.content || "Strategic insight currently unavailable.";

      setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: err.message || "Systems offline. Please verify server connection."
        }
      ]);
    }
  };

  /**
   * Helper function to render text with clickable links.
   * Splits content by spaces and looks for Pinterest search URLs.
   */
  const renderMessageContent = (content) => {
    // Strips asterisks first
    const cleanContent = content.replace(/\*/g, '');
    const words = cleanContent.split(' ');

    return words.map((word, index) => {
      if (word.startsWith('https://')) {
        return (
          <a 
            key={index} 
            href={word} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: '#000', 
              textDecoration: 'underline', 
              fontWeight: '600',
              marginRight: '4px' 
            }}
          >
            Visual Research
          </a>
        );
      }
      return word + ' ';
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} style={btnStyle}>
        {isOpen ? "CLOSE" : "AI CONSULTANT"}
      </button>

      {isOpen && (
        <div style={chatWindowStyle}>
          <div style={headerStyle}>FASHION FORECASTING AI</div>

          <div ref={scrollRef} style={messageContainerStyle}>
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} style={{ 
                  marginBottom: "20px", 
                  textAlign: "left",
                  borderLeft: isUser ? "1px solid #eee" : "1px solid #000",
                  paddingLeft: "12px",
                  marginLeft: isUser ? "24px" : "0"
                }}>
                  <div style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: isUser ? "#888" : "#1a1a1a",
                      whiteSpace: 'pre-wrap'
                    }}>
                    {renderMessageContent(m.content)}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={suggestionContainerStyle}>
            {suggestions.map((text) => (
              <button key={text} onClick={() => sendMessage(text)} style={suggestionBtnStyle}>
                {text}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} style={formStyle}>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Inquire about trends..." 
              style={inputStyle} 
            />
            <button type="submit" style={sendBtnStyle}>→</button>
          </form>
        </div>
      )}
    </>
  );
}

// 🔹 STYLING: LUXURY MINIMALISM
const btnStyle = { 
  position: "fixed", bottom: "30px", right: "30px", 
  background: "#000", color: "#fff", border: "none", 
  padding: "12px 24px", letterSpacing: "0.15em", fontSize: "11px", 
  cursor: "pointer", zIndex: 100, fontWeight: "500"
};

const chatWindowStyle = { 
  position: "fixed", bottom: "90px", right: "30px", 
  width: "320px", height: "500px", background: "#fff", 
  border: "1px solid #000", display: "flex", flexDirection: "column", 
  zIndex: 999, boxShadow: "15px 15px 50px rgba(0,0,0,0.08)" 
};

const headerStyle = { 
  padding: "18px", borderBottom: "1px solid #eee", 
  fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textAlign: "center" 
};

const messageContainerStyle = { 
  flex: 1, padding: "24px 20px", overflowY: "auto", background: "#fff" 
};

const suggestionContainerStyle = { 
  display: 'flex', gap: '6px', padding: '12px 15px', 
  overflowX: 'auto', borderTop: "1px solid #f9f9f9",
  scrollbarWidth: "none"
};

const suggestionBtnStyle = { 
  background: "none", border: "1px solid #eee", padding: "6px 10px", 
  fontSize: "9px", textTransform: "uppercase", cursor: "pointer", 
  letterSpacing: "0.05em", color: "#999", whiteSpace: "nowrap"
};

const formStyle = { 
  display: "flex", borderTop: "1px solid #eee", padding: "5px 20px", background: "#fff" 
};

const inputStyle = { 
  flex: 1, padding: "12px 0", border: "none", outline: "none", 
  fontSize: "13px", color: "#1a1a1a", background: "transparent"
};

const sendBtnStyle = { 
  background: "none", color: "#000", fontSize: "18px", 
  border: "none", cursor: "pointer", paddingLeft: "10px" 
};
