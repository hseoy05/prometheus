import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";
import { sendChatMessage } from "./api/chat";
import type { ChatMessage, ExplanationLevel, StudyMode } from "./types";
import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chapter, setChapter] = useState(1);
  const [mode, setMode] = useState<StudyMode>("질문하기");
  const [level, setLevel] = useState<ExplanationLevel>("low");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage({ message: text, chapter, mode, level });
      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "bot",
        text: reply.text,
        source: reply.source,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "bot",
        text: "죄송해요, 답변을 가져오는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        chapter={chapter}
        onChapterChange={setChapter}
        mode={mode}
        onModeChange={setMode}
        level={level}
        onLevelChange={setLevel}
      />
      <ChatPanel
        chapter={chapter}
        mode={mode}
        level={level}
        messages={messages}
        isLoading={isLoading}
        onSend={handleSend}
      />
    </div>
  );
}
