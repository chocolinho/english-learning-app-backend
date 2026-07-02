import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function PreferenceControls({ compact = false }) {
    const { isDark, toggleTheme } = useTheme();
    const themeLabel = isDark ? "Light" : "Dark";

    const baseButtonClass = compact
        ? "inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-all focus:outline-none focus:ring-4"
        : "inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold transition-all focus:outline-none focus:ring-4";
    const themeButtonClass = `${baseButtonClass} ${
        isDark
            ? "bg-sky-950 text-sky-200 hover:bg-sky-900 focus:ring-sky-900"
            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-100"
    }`;

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={toggleTheme}
                className={themeButtonClass}
                aria-label={`Switch to ${themeLabel.toLowerCase()} mode`}
                aria-pressed={isDark}
                title={`Switch to ${themeLabel.toLowerCase()} mode`}
            >
                {isDark ? (
                    <Sun className="h-4 w-4" />
                ) : (
                    <Moon className="h-4 w-4" />
                )}
                {!compact && <span>{themeLabel}</span>}
            </button>
        </div>
    );
}

export default PreferenceControls;
