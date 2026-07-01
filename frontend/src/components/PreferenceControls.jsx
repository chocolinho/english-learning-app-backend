import { Languages, Moon, Sun } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

function PreferenceControls({ compact = false }) {
    const { language, toggleLanguage, t } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    const buttonClass = compact
        ? "inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-green-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        : "inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 transition-all hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-green-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={toggleLanguage}
                className={buttonClass}
                aria-label={t("language")}
                title={t("language")}
            >
                <Languages className="h-4 w-4" />
                {!compact && <span>{language.toUpperCase()}</span>}
            </button>
            <button
                type="button"
                onClick={toggleTheme}
                className={buttonClass}
                aria-label={isDark ? t("lightMode") : t("darkMode")}
                title={isDark ? t("lightMode") : t("darkMode")}
            >
                {isDark ? (
                    <Sun className="h-4 w-4" />
                ) : (
                    <Moon className="h-4 w-4" />
                )}
                {!compact && <span>{isDark ? t("lightMode") : t("darkMode")}</span>}
            </button>
        </div>
    );
}

export default PreferenceControls;
