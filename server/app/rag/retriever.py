"""챕터별 교재 내용을 벡터DB(Chroma)에서 검색한다.

기초스터디프로젝트_v2.ipynb에서 만든 vector_db(임베딩 모델: jhgan/ko-sroberta-multitask)를
그대로 재사용한다. 청크 메타데이터에는 chapter(주차) 필드가 따로 없어서,
source 파일명(예: wk3_ch4.pdf, basic_wk3.ipynb)에 포함된 wk{N} 표기로 chapter를 추정한다.
"""

import re
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from app.config import settings

_WEEK_PATTERN = re.compile(r"wk(\d+)", re.IGNORECASE)


@dataclass
class RetrievedChunk:
    text: str
    chapter: int
    page: str
    score: float
    source_file: str


@lru_cache(maxsize=1)
def _get_vector_store() -> Chroma:
    embeddings = HuggingFaceEmbeddings(
        model_name=settings.embedding_model_name,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )
    return Chroma(
        collection_name=settings.chroma_collection_name,
        persist_directory=settings.vector_db_path,
        embedding_function=embeddings,
    )


def _parse_chapter(source_file: str) -> int:
    match = _WEEK_PATTERN.search(source_file)
    return int(match.group(1)) if match else 0


def _to_chunk(document, score: float) -> RetrievedChunk:
    metadata = document.metadata or {}
    source_file = Path(str(metadata.get("source", "출처 미상"))).name
    page = str(metadata.get("page_label", metadata.get("page", "-")))

    return RetrievedChunk(
        text=document.page_content,
        chapter=_parse_chapter(source_file),
        page=page,
        score=score,
        source_file=source_file,
    )


def retrieve(query: str, chapter: int, top_k: int = 5) -> list[RetrievedChunk]:
    """query와 관련된 교재 chunk를 top_k개 검색한다.

    같은 chapter(wk{chapter}) 자료를 우선순위로 채우고, 부족하면 다른 chapter로
    나머지를 채우는 소프트 필터 방식이다(사용자가 챕터를 잘못 선택해도 완전히
    빈 응답이 되지 않도록 하기 위함).
    """
    vector_store = _get_vector_store()
    pool_size = max(top_k * 4, 20)

    scored_documents = vector_store.similarity_search_with_score(query, k=pool_size)
    chunks = [_to_chunk(document, score) for document, score in scored_documents]

    same_chapter = [chunk for chunk in chunks if chunk.chapter == chapter]
    other_chapters = [chunk for chunk in chunks if chunk.chapter != chapter]

    return (same_chapter + other_chapters)[:top_k]
