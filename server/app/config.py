"""환경변수 기반 설정값을 한 곳에서 관리한다."""

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

_PROJECT_ROOT = Path(__file__).resolve().parents[2]
_DEFAULT_VECTOR_DB_PATH = _PROJECT_ROOT / "vector_db"
_DEFAULT_FEWSHOT_PATH = _PROJECT_ROOT / "fewshot_llm_qa.json"


@dataclass(frozen=True)
class Settings:
    google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
    vector_db_path: str = os.getenv("VECTOR_DB_PATH") or str(_DEFAULT_VECTOR_DB_PATH)
    fewshot_path: str = os.getenv("FEWSHOT_PATH") or str(_DEFAULT_FEWSHOT_PATH)
    embedding_model_name: str = os.getenv("EMBEDDING_MODEL_NAME", "jhgan/ko-sroberta-multitask")
    chroma_collection_name: str = os.getenv("CHROMA_COLLECTION_NAME", "langchain")
    gemini_model_name: str = os.getenv("GEMINI_MODEL_NAME", "gemini-3.5-flash")


settings = Settings()
