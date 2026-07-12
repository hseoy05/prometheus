import { findBestMatch } from "../data/qa";
import type { ExplanationLevel, StudyMode } from "../types";

export interface ChatRequestPayload {
  message: string;
  chapter: number;
  mode: StudyMode;
  level: ExplanationLevel;
}

export interface ChatResponsePayload {
  text: string;
  source?: string;
}

// 백엔드(RAG) 연동 전에는 목업 응답을 쓰고, 준비되면 false로 바꾸면 됩니다.
// .env 파일에 VITE_USE_MOCK_CHAT=false 를 설정해도 동일하게 전환됩니다.
const USE_MOCK = import.meta.env.VITE_USE_MOCK_CHAT !== "false";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function buildMockResponse(payload: ChatRequestPayload): ChatResponsePayload {
  const { message, mode, level, chapter } = payload;
  const match = findBestMatch(message);

  if (!match) {
    return {
      text: `아직 ${chapter}장 자료에서 관련 내용을 찾지 못했어요. 질문을 조금 더 구체적으로 표현해 주시면 다시 찾아볼게요.`,
    };
  }

  let text = match.answer;

  if (mode === "코드 해설") {
    text = `코드 관점에서 보면, ${text}`;
  } else if (mode === "퀴즈") {
    text = `퀴즈로 바꿔볼게요 — "${match.question}"\n\n정답: ${text}`;
  } else if (mode === "시험 대비") {
    text = `[시험 포인트] ${text}`;
  }

  if (level === "초보자") {
    text = `${text}\n\n(쉽게 말하면, 기본 개념부터 차근차근 이해하면 돼요.)`;
  } else if (level === "시험 대비") {
    text = `${text}\n\n(핵심 키워드 위주로 암기해두세요.)`;
  }

  return { text, source: `Chapter ${match.chapter}, p.${match.page}` };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 실제 RAG 백엔드가 준비되면 이 함수만 fetch 로직으로 교체하면 됩니다.
// 요청/응답 형태는 server/app/main.py의 POST /api/chat 스펙과 맞춰져 있습니다.
export async function sendChatMessage(payload: ChatRequestPayload): Promise<ChatResponsePayload> {
  if (USE_MOCK) {
    await delay(400 + Math.random() * 400);
    return buildMockResponse(payload);
  }

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`챗봇 응답 요청 실패: ${response.status}`);
  }

  return (await response.json()) as ChatResponsePayload;
}
