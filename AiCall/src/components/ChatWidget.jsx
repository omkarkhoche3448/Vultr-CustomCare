import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader } from 'lucide-react';
import './ChatWidget.css';

const API_URL = 'http://localhost:8000/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState(() => 
    localStorage.getItem('chatSessionToken')
  );

  useEffect(() => {
    const generateToken = async () => {
      if (!sessionToken) {
        try {
          const response = await fetch(`${API_URL}/generate-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          setSessionToken(data.token);
          localStorage.setItem('chatSessionToken', data.token);
        } catch (error) {
          console.error('Error generating token:', error);
        }
      }
    };

    generateToken();
  }, []);

  useEffect(() => {
    if (sessionToken) {
      loadMessages();
    }
  }, [sessionToken]);

  useEffect(() => {
    if (isOpen) {
      const messagesContainer = document.querySelector('.chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/session-messages/${sessionToken}`);
      const data = await response.json();
      if (data.messages) {
        const formattedMessages = data.messages.map(msg => ([
          {
            role: 'user',
            content: msg.message,
            timestamp: msg.created_at
          },
          {
            role: 'assistant',
            content: msg.response,
            timestamp: msg.created_at
          }
        ])).flat();
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !sessionToken) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          session_token: sessionToken
        })
      });
      
      const data = await response.json();
      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.message.response,
          timestamp: data.message.created_at
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        console.error('Error sending message:', data.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewSession = async () => {
    try {
      const response = await fetch(`${API_URL}/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setSessionToken(data.token);
      localStorage.setItem('chatSessionToken', data.token);
      setMessages([]);
    } catch (error) {
      console.error('Error generating new token:', error);
    }
  };

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="chat-toggle"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="icon" size={24} />
        ) : (
          <MessageCircle className="icon" size={24} />
        )}
      </button>
      
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-title">
            <Bot size={20} />
            <h3>Sales Coach AI</h3>
          </div>
          <button 
            onClick={startNewSession}
            className="new-chat-button"
            aria-label="Start new chat"
          >
            New Chat
          </button>
        </div>
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div 
              key={`${msg.timestamp}-${idx}`} 
              className={`message ${msg.role}`}
            >
              <div className="message-content">
                {msg.role === 'assistant' && <Bot size={16} className="message-icon" />}
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="message-content">
                <Bot size={16} className="message-icon" />
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your sales question..."
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend} 
            disabled={loading}
            className="send-button"
            aria-label="Send message"
          >
            {loading ? (
              <Loader className="spin" size={18} />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;