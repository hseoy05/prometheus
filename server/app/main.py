from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.rag import generator, retriever
from app.schemas import ChatRequest, ChatResponse

app = FastAPI(title="PromeTutor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    chunks = retriever.retrieve(request.message, request.chapter)

    if not chunks:
        return ChatResponse(
            text=(
                f"아직 {request.chapter}장 자료에서 관련 내용을 찾지 못했어요. "
                "질문을 조금 더 구체적으로 표현해 주시면 다시 찾아볼게요."
            ),
            source=None,
        )

    text = generator.generate_answer(request.message, chunks, request.mode, request.level)
    source = f"Chapter {chunks[0].chapter}, p.{chunks[0].page}"

    return ChatResponse(text=text, source=source)
