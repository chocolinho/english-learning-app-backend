import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    BarChart3,
    BookOpen,
    Home,
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PreferenceControls from "../components/PreferenceControls";
import { useLanguage } from "../context/LanguageContext";

function AdminLayout() {
    const { logout, user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition-all focus:outline-none focus:ring-4 focus:ring-sky-100 ${
            isActive
                ? "bg-[#1CB0F6] text-white shadow-lg shadow-sky-100"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`;

    return (
        <div className="min-h-screen bg-[#F6F8FB] text-slate-800">
            <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col border-r border-slate-100 bg-white p-6 lg:flex">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1CB0F6] shadow-lg shadow-sky-100">
                        <ShieldCheck className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">
                            Admin
                        </h1>
                        <p className="text-xs font-bold text-slate-400">
                            LinguaKid Console
                        </p>
                    </div>
                </div>

                <div className="mb-5">
                    <PreferenceControls />
                </div>

                <div className="mb-7 rounded-[1.75rem] border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1CB0F6] shadow-sm">
                            <UserRound className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-800">
                                {user?.username || user?.email || "Admin"}
                            </p>
                            <p className="text-xs font-bold text-slate-400">
                                {user?.role || "ADMIN"}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2" aria-label="Admin navigation">
                    <NavLink to="/admin/dashboard" className={navLinkClass}>
                        <LayoutDashboard className="h-5 w-5" />
                        {t("dashboard")}
                    </NavLink>
                    <NavLink to="/admin/analytics" className={navLinkClass}>
                        <BarChart3 className="h-5 w-5" />
                        {t("analytics")}
                    </NavLink>
                    <NavLink to="/admin/topics" className={navLinkClass}>
                        <BookOpen className="h-5 w-5" />
                        {t("topics")}
                    </NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>
                        <Home className="h-5 w-5" />
                        User App
                    </NavLink>
                </nav>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-6 flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-black text-red-500 transition-all hover:bg-red-50"
                >
                    <LogOut className="h-5 w-5" />
                    {t("logout")}
                </button>
            </aside>

            <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1CB0F6]">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">
                                Admin Console
                            </h1>
                            <p className="text-xs font-bold text-slate-400">
                                {user?.username || user?.email || "Admin"}
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

                <nav className="mt-3 grid grid-cols-4 gap-2" aria-label="Mobile admin navigation">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-black ${
                                isActive
                                    ? "bg-sky-50 text-[#1CB0F6]"
                                    : "bg-slate-50 text-slate-500"
                            }`
                        }
                    >
                        <BarChart3 className="h-4 w-4" />
                        {t("admin")}
                    </NavLink>
                    <NavLink
                        to="/admin/analytics"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-black ${
                                isActive
                                    ? "bg-sky-50 text-[#1CB0F6]"
                                    : "bg-slate-50 text-slate-500"
                            }`
                        }
                    >
                        <BarChart3 className="h-4 w-4" />
                        {t("analytics")}
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-black text-slate-500"
                    >
                        <Home className="h-4 w-4" />
                        App
                    </NavLink>
                    <NavLink
                        to="/admin/topics"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-black ${
                                isActive
                                    ? "bg-sky-50 text-[#1CB0F6]"
                                    : "bg-slate-50 text-slate-500"
                            }`
                        }
                    >
                        <BookOpen className="h-4 w-4" />
                        {t("topics")}
                    </NavLink>
                </nav>
            </header>

            <main className="px-4 py-5 md:px-8 md:py-8 lg:ml-72">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
