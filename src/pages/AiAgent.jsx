
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CheckCircle, AlertTriangle, Lightbulb, FileText } from 'lucide-react';
import { AI_SUGGESTIONS, AI_RESPONSES } from '../services/mockData';

const AiAgent = () => {
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: '안녕하세요! 인력 전략 AI 에이전트입니다. 궁금한 점을 물어보시거나 아래 추천 질문을 선택해주세요.',
            isWelcome: true
        }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleQuestion = (question) => {
        setMessages(prev => [...prev, { type: 'user', text: question }]);
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const response = AI_RESPONSES[question] || AI_RESPONSES['default'];
            setMessages(prev => [...prev, { type: 'bot', data: response, originalQuestion: question }]);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="page-container" style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={32} color="var(--accent-primary)" />
                AI Strategy Agent
            </h1>

            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>

                {/* Chat Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>

                            {/* User Message */}
                            {msg.type === 'user' && (
                                <div style={{ background: 'var(--accent-primary)', color: 'white', padding: '1rem', borderRadius: '12px 12px 0 12px', fontSize: '1rem' }}>
                                    {msg.text}
                                </div>
                            )}

                            {/* Bot Message */}
                            {msg.type === 'bot' && (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ minWidth: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                                        <Bot size={20} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                                        {msg.isWelcome ? (
                                            <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '0 12px 12px 12px', border: '1px solid var(--glass-border)' }}>
                                                {msg.text}
                                            </div>
                                        ) : (
                                            // Structured Response
                                            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '0 12px 12px 12px', borderColor: 'var(--accent-primary)' }}>
                                                <div style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                                    {msg.data.summary}
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>

                                                    {/* Evidence */}
                                                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                                                            <FileText size={18} /> 근거 데이터
                                                        </div>
                                                        <div style={{ fontSize: '0.95rem' }}>{msg.data.evidence}</div>
                                                    </div>

                                                    {/* Risk */}
                                                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-danger)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-danger)', fontWeight: 'bold' }}>
                                                            <AlertTriangle size={18} /> 리스크
                                                        </div>
                                                        <div style={{ fontSize: '0.95rem' }}>{msg.data.risk}</div>
                                                    </div>

                                                    {/* Alternative */}
                                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-success)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>
                                                            <Lightbulb size={18} /> 대안 제안
                                                        </div>
                                                        <div style={{ fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{msg.data.alternative}</div>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ minWidth: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot size={20} />
                            </div>
                            <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '0 12px 12px 12px', color: 'var(--text-secondary)' }}>
                                Analyzing manpower data...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestion & Input Area */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }}>
                    {/* Suggestions */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {AI_SUGGESTIONS.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleQuestion(q)}
                                disabled={loading}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--accent-primary)',
                                    color: 'var(--text-primary)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    opacity: loading ? 0.5 : 1
                                }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Input Placeholder (Visual only for now since we drive by suggestions mostly) */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="추천 질문을 선택하거나 직접 입력하세요..."
                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white' }}
                        />
                        <button className="btn btn-primary" style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiAgent;
