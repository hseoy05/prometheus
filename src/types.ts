export type StudyMode = "질문하기" | "코드 해설" | "퀴즈" | "시험 대비";

export type ExplanationLevel = "초보자" | "교재" | "시험 대비";

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  source?: string;
}
