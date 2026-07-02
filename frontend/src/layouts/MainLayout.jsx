import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    BookOpen,
    Brain,
    Crown,
    Flame,
    GraduationCap,
    Heart,
    Home,
    LogOut,
    Receipt,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import PreferenceControls from "../components/PreferenceControls";

function MainLayout() {
    const { logout, user, loadingUser, isPremium } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const displayName = user?.username || user?.email || "Learner";
    const totalXp = user?.xp ?? 0;
    const level = user?.level ?? 1;
    const levelProgress = Math.min(user?.levelProgress ?? 0, 100);
    const nextLevelXp = user?.nextLevelXp ?? 100;
    const isAdmin = user?.role === "ADMIN";
    const planLabel = isPremium ? t("premiumPlan") : t("freePlan");

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const navItems = [
        { to: "/dashboard", label: t("dashboard"), icon: Home },
        { to: "/learn", label: t("learn"), icon: GraduationCap },
        { to: "/quiz", label: t("quiz"), icon: Target },
        { to: "/ranking", label: t("ranking"), icon: Trophy },
    ];

    const secondaryNavItems = [
        ...(isAdmin
            ? [{ to: "/admin/dashboard", label: t("admin"), icon: ShieldCheck }]
            : []),
        { to: "/analytics", label: t("analytics"), icon: Sparkles },
        { to: "/achievements", label: t("badges"), icon: Flame },
        { to: "/review", label: t("review"), icon: Sparkles },
        { to: "/quiz-results", label: t("results"), icon: Trophy },
        { to: "/favorites", label: t("favorites"), icon: Heart },
        { to: "/premium", label: t("premium"), icon: Crown },
        { to: "/payments", label: t("payments"), icon: Receipt },
        { to: "/profile", label: t("profile"), icon: UserRound },
        { to: "/topics", label: t("topics"), icon: BookOpen },
        { to: "/vocabularies", label: t("words"), icon: Brain },
    ];

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-green-100 ${
            isActive
                ? "bg-[#58CC02] text-white shadow-lg shadow-green-100"
                : "text-slate-600 hover:bg-green-50 hover:text-[#58CC02] dark:text-slate-300 dark:hover:bg-green-950"
        }`;

    return (
        <div className="min-h-screen bg-[#F6F8FB] text-slate-800">
            <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col overflow-y-auto border-r border-green-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:flex">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#58CC02] shadow-lg shadow-green-100">
                        <BookOpen className="h-7 w-7 text-white" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            LinguaKid
                        </h1>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                            {t("englishLearning")}
                        </p>
                    </div>
                </div>

                <div className="mb-5">
                    <PreferenceControls />
                </div>

                <div className="mb-7 rounded-[1.5rem] border border-green-100 bg-green-50/70 p-4 dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1CB0F6] shadow-sm">
                            <UserRound className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">
                                {loadingUser ? t("loading") : displayName}
                            </p>
                            <p className="text-xs font-bold text-slate-400">
                                Level {level} - {totalXp} XP
                            </p>
                        </div>
                    </div>

                    <div
                        className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
                            isPremium
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-slate-100 text-slate-500"
                        }`}
                    >
                        <Crown className="h-4 w-4" />
                            {planLabel}
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                        <div
                            className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                            style={{ width: `${levelProgress}%` }}
                        />
                    </div>

                    <p className="mt-2 text-xs font-bold text-slate-400">
                        {totalXp} / {nextLevelXp} XP
                    </p>
                </div>

                <nav className="flex-1 space-y-2" aria-label="Main navigation">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={navLinkClass}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </NavLink>
                        );
                    })}

                    <div className="pt-4">
                        <p className="px-4 pb-2 text-xs font-bold uppercase text-slate-400">
                            {t("more")}
                        </p>
                        <div className="space-y-2">
                            {secondaryNavItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={navLinkClass}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                </nav>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-6 flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-bold text-red-500 transition-all hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                >
                    <LogOut className="h-5 w-5" />
                    {t("logout")}
                </button>
            </aside>

            <header className="sticky top-0 z-20 border-b border-green-100 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#58CC02]">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold text-slate-900">
                                LinguaKid
                            </h1>
                            <p className="truncate text-xs font-bold text-slate-400 dark:text-slate-500">
                                {displayName} - Level {level} - {planLabel}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <PreferenceControls compact />
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-2xl bg-red-50 p-3 text-red-500 dark:bg-red-950/40"
                            aria-label={t("logout")}
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-yellow-500" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                            style={{ width: `${levelProgress}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                        {totalXp} XP
                    </span>
                </div>

                <nav
                    className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1"
                    aria-label="Secondary mobile navigation"
                >
                    {secondaryNavItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `inline-flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold transition-all ${
                                        isActive
                                            ? "bg-green-50 text-[#58CC02]"
                                            : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                                    } focus:outline-none focus:ring-4 focus:ring-green-100`
                                }
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>
            </header>

            <main className="px-4 py-5 pb-24 md:px-8 md:py-8 lg:ml-72 lg:pb-8">
                <Outlet />
            </main>

            <nav
                className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 gap-1 border-t border-green-100 bg-white/95 px-2 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden"
                aria-label="Primary mobile navigation"
            >
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold transition-all ${
                                    isActive
                                        ? "bg-green-50 text-[#58CC02]"
                                        : "text-slate-400"
                                } focus:outline-none focus:ring-4 focus:ring-green-100`
                            }
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
}

export default MainLayout;

