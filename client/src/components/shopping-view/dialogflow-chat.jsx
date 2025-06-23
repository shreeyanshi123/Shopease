import React, { useState } from 'react';

const DialogflowChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/dialogflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error contacting bot.' }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 z-50"
        onClick={() => setOpen((o) => !o)}
      >
        Chat
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-2xl flex flex-col z-50">
          <div className="p-4 border-b font-bold">Ask ShopEase</div>
          <div className="flex-1 p-4 overflow-y-auto max-h-80">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 text-sm ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>{msg.text}</span>
              </div>
            ))}
            {loading && <div className="text-gray-400">Bot is typing...</div>}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 focus:outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              disabled={loading}
            />
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
              onClick={handleSend}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogflowChat;
