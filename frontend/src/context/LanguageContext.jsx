import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext();

const translations = {
    en: {
        dashboard: "Dashboard",
        analytics: "Analytics",
        learn: "Learn",
        quiz: "Quiz",
        ranking: "Ranking",
        admin: "Admin",
        badges: "Badges",
        review: "Review",
        results: "Results",
        favorites: "Favorites",
        premium: "Premium",
        payments: "Payments",
        profile: "Profile",
        topics: "Topics",
        words: "Words",
        more: "More",
        logout: "Logout",
        loading: "Loading...",
        englishLearning: "English Learning",
        freePlan: "Free Plan",
        premiumPlan: "Premium Plan",
        lightMode: "Light",
        darkMode: "Dark",
        language: "Language",
        leaderboard: "Leaderboard",
        topLearners: "Top learners",
        rank: "Rank",
        learner: "Learner",
        level: "Level",
        streak: "Streak",
        xp: "XP",
        yourRank: "Your rank",
        learningLeague: "Learning league",
        rankingIntro: "Compare progress by XP and keep steady learning momentum.",
        noRanking: "No ranking data yet.",
    },
    vi: {
        dashboard: "Tổng quan",
        analytics: "Phân tích",
        learn: "Học",
        quiz: "Quiz",
        ranking: "Xếp hạng",
        admin: "Quản trị",
        badges: "Huy hiệu",
        review: "Ôn tập",
        results: "Kết quả",
        favorites: "Yêu thích",
        premium: "Premium",
        payments: "Thanh toán",
        profile: "Hồ sơ",
        topics: "Chủ đề",
        words: "Từ vựng",
        more: "Thêm",
        logout: "Đăng xuất",
        loading: "Đang tải...",
        englishLearning: "Học tiếng Anh",
        freePlan: "Gói Free",
        premiumPlan: "Gói Premium",
        lightMode: "Sáng",
        darkMode: "Tối",
        language: "Ngôn ngữ",
        leaderboard: "Bảng xếp hạng",
        topLearners: "Người học nổi bật",
        rank: "Hạng",
        learner: "Người học",
        level: "Cấp",
        streak: "Chuỗi ngày",
        xp: "XP",
        yourRank: "Hạng của bạn",
        learningLeague: "Đường đua học tập",
        rankingIntro: "So sánh tiến độ theo XP và giữ nhịp học đều đặn.",
        noRanking: "Chưa có dữ liệu xếp hạng.",
    },
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(
        () => localStorage.getItem("language") || "en"
    );

    const value = useMemo(
        () => ({
            language,
            setLanguage: (nextLanguage) => {
                localStorage.setItem("language", nextLanguage);
                setLanguage(nextLanguage);
            },
            toggleLanguage: () => {
                const nextLanguage = language === "en" ? "vi" : "en";
                localStorage.setItem("language", nextLanguage);
                setLanguage(nextLanguage);
            },
            t: (key) => translations[language]?.[key] || translations.en[key] || key,
        }),
        [language]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
    return useContext(LanguageContext);
}
