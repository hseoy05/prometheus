import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage, ExplanationLevel, StudyMode } from "./types";

interface ChatPanelProps {
  chapter: number;
  mode: StudyMode;
  level: ExplanationLevel;
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (text: string) => void;
}

export default function ChatPanel({ chapter, mode, level, messages, isLoading, onSend }: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="chat-panel">
      <header className="chat-panel__meta">
        <span className="chat-panel__meta-item">Chapter {chapter}</span>
        <span className="chat-panel__meta-dot">·</span>
        <span className="chat-panel__meta-item">{mode}</span>
        <span className="chat-panel__meta-dot">·</span>
        <span className="chat-panel__meta-item">{level}</span>
      </header>

      <div className="composer">
        <textarea
          className="composer__textarea"
          placeholder="메시지를 입력하세요..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button className="composer__send" onClick={handleSend} disabled={!draft.trim() || isLoading}>
          전송
        </button>
      </div>

      <div className="history" ref={historyRef}>
        {messages.length === 0 && (
          <p className="history__quote">
            "The unexamined life is not worth living."
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`message message--${m.role}`}>
            <div className="message__bubble">
              {m.role === "bot" ? (
                <div className="message__markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="message__text">{m.text}</p>
              )}
              {m.source && <p className="message__source">출처: {m.source}</p>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message--bot">
            <div className="message__bubble message__bubble--loading">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
