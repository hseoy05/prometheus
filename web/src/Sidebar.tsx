import type { ExplanationLevel, StudyMode } from "./types";

const STUDY_MODES: StudyMode[] = ["질문하기", "코드 해설", "퀴즈", "시험 대비"];
const LEVELS: ExplanationLevel[] = ["low", "high"];
const CHAPTERS = Array.from({ length: 9 }, (_, i) => i + 1);

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chapter: number;
  onChapterChange: (chapter: number) => void;
  mode: StudyMode;
  onModeChange: (mode: StudyMode) => void;
  level: ExplanationLevel;
  onLevelChange: (level: ExplanationLevel) => void;
}

export default function Sidebar({
  isOpen,
  onToggle,
  chapter,
  onChapterChange,
  mode,
  onModeChange,
  level,
  onLevelChange,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--closed"}`}>
      <button
        className="sidebar__toggle"
        onClick={onToggle}
        aria-label={isOpen ? "사이드바 접기" : "사이드바 펼치기"}
      >
        {isOpen ? "‹" : "›"}
      </button>

      {isOpen && (
        <div className="sidebar__content">
          <div className="sidebar__brand">
            <h1 className="sidebar__logo">PromeTutor</h1>
            <p className="sidebar__tagline">기초스터디 머신러닝・딥러닝 학습 챗봇</p>
          </div>

          <div className="sidebar__section">
            <label className="sidebar__section-title" htmlFor="chapter-select">
              Chapter
            </label>
            <div className="chapter-select">
              <select
                id="chapter-select"
                value={chapter}
                onChange={(e) => onChapterChange(Number(e.target.value))}
              >
                {CHAPTERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="chapter-select__arrow">▾</span>
            </div>
          </div>

          <div className="sidebar__section">
            <h2 className="sidebar__section-title">학습 모드</h2>
            <ul className="option-list">
              {STUDY_MODES.map((m) => (
                <li key={m}>
                  <button
                    type="button"
                    className="option-item"
                    onClick={() => onModeChange(m)}
                    aria-pressed={mode === m}
                  >
                    <span className={`option-dot ${mode === m ? "option-dot--filled" : ""}`} />
                    <span>{m}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar__section">
            <h2 className="sidebar__section-title">설명 수준</h2>
            <ul className="option-list">
              {LEVELS.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    className="option-item"
                    onClick={() => onLevelChange(l)}
                    aria-pressed={level === l}
                  >
                    <span className={`option-dot ${level === l ? "option-dot--filled" : ""}`} />
                    <span>{l}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </aside>
  );
}
