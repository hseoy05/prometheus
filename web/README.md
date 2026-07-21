# PromeTutor

프로메테우스 스터디 그룹을 위한 머신러닝·딥러닝 학습 질의응답 챗봇 웹서비스입니다.
학습 모드(질문하기 / 코드 해설 / 퀴즈 / 시험 대비)와 설명 수준(초보자 / 교재 / 시험 대비)을 선택해 챕터별로 질문할 수 있습니다.

## 프로젝트 구성

현재 `server`는 RAG(검색 증강 생성) 파이프라인이 붙기 전 단계라, 정해진 요청/응답 형태만 갖춘 뼈대 상태입니다. 프론트엔드는 목업 데이터로 먼저 동작하며, 환경변수 하나로 실제 백엔드 호출로 전환할 수 있게 만들어져 있습니다.

```
prometheus/
├─ README.md
│
├─ web/                      # 프론트엔드 (React + Vite + TypeScript)
│  ├─ index.html
│  ├─ package.json
│  ├─ vite.config.ts
│  ├─ tsconfig.json
│  ├─ .env.example           # VITE_USE_MOCK_CHAT, VITE_API_BASE_URL
│  ├─ public/
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  └─ src/
│     ├─ main.tsx            # React 엔트리 포인트
│     ├─ App.tsx             # 전체 레이아웃, 대화 상태 관리
│     ├─ App.css             # 레이아웃/디자인 스타일
│     ├─ index.css           # 전역 리셋, 폰트, 스크롤바
│     ├─ types.ts            # StudyMode, ExplanationLevel, ChatMessage 타입
│     ├─ Sidebar.tsx         # Chapter / 학습 모드 / 설명 수준 사이드바
│     ├─ ChatPanel.tsx       # 상단 입력창 + 대화 내역
│     ├─ api/
│     │  └─ chat.ts          # 목업 ↔ 백엔드 API 전환 계층
│     └─ data/
│        └─ qa.ts            # 목업 Q&A 데이터 + 키워드 매칭
│
└─ server/                   # 백엔드 (Python + FastAPI, RAG 연결 예정)
   ├─ requirements.txt
   ├─ .env.example
   └─ app/
      ├─ main.py             # FastAPI 앱, /api/health, /api/chat
      ├─ schemas.py          # ChatRequest / ChatResponse 스키마
      └─ rag/
         ├─ retriever.py     # 챕터별 교재 검색 (미구현)
         └─ generator.py     # 검색 결과 기반 답변 생성 (미구현)
```

## 프론트엔드 (`web/`)

### 기술 스택

- React + Vite + TypeScript
- 순수 CSS (별도 UI 라이브러리 없음)

### 주요 화면 구성

- **사이드바** (`Sidebar.tsx`): 펼치기/접기가 가능하며 Chapter 선택, 학습 모드, 설명 수준을 고릅니다. 선택된 항목은 채워진 동그라미로 표시됩니다.
- **채팅 패널** (`ChatPanel.tsx`): 입력창이 화면 하단이 아닌 **상단**에 고정되어 있고, 크기가 고정된 텍스트박스라 내용이 길어지면 내부 스크롤이 생깁니다. 대화 내역은 입력창 아래로 쌓입니다.
- **타이포그래피**: 로고(Bebas Neue), 명언(Playfair Display 이탤릭), 본문(Montserrat), 섹션 제목(Cormorant Garamond)

### 프론트-백엔드 연동 구조

`src/api/chat.ts`가 요청을 보내는 유일한 창구입니다.

- `VITE_USE_MOCK_CHAT=true` (기본값): `src/data/qa.ts`의 목업 Q&A 데이터에서 키워드 매칭으로 답을 찾아 응답합니다.
- `VITE_USE_MOCK_CHAT=false`: `VITE_API_BASE_URL`(기본 `http://localhost:8000`)의 `POST /api/chat`을 실제로 호출합니다.

요청/응답 형태는 `server/app/schemas.py`의 `ChatRequest` / `ChatResponse`와 1:1로 맞춰뒀기 때문에, 백엔드에 RAG가 붙어도 프론트 코드는 수정할 필요가 없습니다.

```
POST /api/chat
{ "message": "표준화가 왜 필요해?", "chapter": 2, "mode": "질문하기", "level": "초보자" }

→ { "text": "...", "source": "Chapter 2, p.109" }
```

### 실행 방법

```bash
cd web
npm install
npm run dev
```

`.env.example`을 참고해 `.env`를 만들면 목업/실제 백엔드 전환 값을 조정할 수 있습니다.

## 백엔드 (`server/`)

### 기술 스택

- Python + FastAPI

### 현재 상태

RAG 파이프라인(임베딩, 벡터DB 검색, LLM 응답 생성)은 아직 구현되지 않았습니다. `POST /api/chat`은 요청을 받아 자리표시자 텍스트를 반환하며, 실제 로직이 들어갈 자리에 TODO 주석으로 표시해뒀습니다. (파일 구조는 위 "프로젝트 구성" 참고)

RAG를 붙일 때는 `app/main.py`의 `chat()` 함수 안 TODO 주석 부분에서 `retriever.retrieve()` → `generator.generate_answer()` 순서로 호출하도록 구현하면 됩니다.

### 실행 방법

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

프론트엔드에서 실제 백엔드를 쓰려면 `web/.env`에 `VITE_USE_MOCK_CHAT=false`를 설정하세요.
