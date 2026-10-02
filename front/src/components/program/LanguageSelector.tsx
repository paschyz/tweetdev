import { LANGUAGE_VERSIONS } from "../../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue.400";

const LanguageSelector = ({ language, onSelect, isModifiable = false }) => {
  return (
    <details className={`dropdown ${isModifiable ? "" : "cursor-not-allowed"}`}>
      <summary
        className={`btn px-2 min-h-0 h-6 ${
          isModifiable ? "" : "text-gray-500"
        }`}
        style={{ pointerEvents: isModifiable ? "auto" : "none" }}
      >
        {language}
      </summary>
      <ul
        className={`menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow ${
          isModifiable ? "" : "pointer-events-none opacity-50"
        }`}
      >
        {languages.map(([lang, key]) => (
          <li key={key} className={isModifiable ? "" : "text-gray-500"}>
            <a
              onClick={() => isModifiable && onSelect(lang)}
              style={{ pointerEvents: isModifiable ? "auto" : "none" }}
            >
              {lang}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default LanguageSelector;
