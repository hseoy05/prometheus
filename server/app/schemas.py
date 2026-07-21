from typing import Literal

from pydantic import BaseModel

StudyMode = Literal["질문하기", "코드 해설", "퀴즈", "시험 대비"]
ExplanationLevel = Literal["low", "high"]


class ChatRequest(BaseModel):
    """프론트엔드 web/src/api/chat.ts의 ChatRequestPayload와 형태를 맞춘 요청 스키마."""

    message: str
    chapter: int
    mode: StudyMode
    level: ExplanationLevel


class ChatResponse(BaseModel):
    """프론트엔드 web/src/api/chat.ts의 ChatResponsePayload와 형태를 맞춘 응답 스키마."""

    text: str
    source: str | None = None
