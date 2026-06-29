import { useEffect, useState } from "react";
import {
    BarChart3,
    BookOpen,
    Brain,
    ClipboardCheck,
    Crown,
    Lock,
    Users,
} from "lucide-react";
import PageSkeleton from "../../components/PageSkeleton";
import { getAdminStats } from "../../services/adminService";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setErrorMessage("");
                setStats(await getAdminStats());
            } catch (error) {
                console.error(error);
                setErrorMessage("Failed to load admin statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    const cards = [
        {
            label: "Users",
            value: stats?.totalUsers ?? 0,
            icon: Users,
            color: "bg-sky-100 text-[#1CB0F6]",
        },
        {
            label: "Free Users",
            value: stats?.freeUsers ?? 0,
            icon: Lock,
            color: "bg-slate-100 text-slate-500",
        },
        {
            label: "Premium Users",
            value: stats?.premiumUsers ?? 0,
            icon: Crown,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            label: "Topics",
            value: stats?.totalTopics ?? 0,
            icon: BookOpen,
            color: "bg-green-100 text-[#58CC02]",
        },
        {
            label: "Free Topics",
            value: stats?.freeTopics ?? 0,
            icon: BookOpen,
            color: "bg-emerald-100 text-emerald-600",
        },
        {
            label: "Premium Topics",
            value: stats?.premiumTopics ?? 0,
            icon: Crown,
            color: "bg-amber-100 text-amber-600",
        },
        {
            label: "Vocabularies",
            value: stats?.totalVocabularies ?? 0,
            icon: Brain,
            color: "bg-purple-100 text-purple-500",
        },
        {
            label: "Quiz Attempts",
            value: stats?.totalQuizAttempts ?? 0,
            icon: ClipboardCheck,
            color: "bg-yellow-100 text-yellow-500",
        },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-[2rem] bg-gradient-to-br from-[#1CB0F6] via-[#58CC02] to-[#CE82FF] p-6 text-white shadow-xl shadow-sky-100 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black">
                            <BarChart3 className="h-4 w-4" />
                            Admin analytics
                        </div>
                        <h1 className="text-3xl font-black md:text-5xl">
                            Admin Dashboard
                        </h1>
                        <p className="mt-3 max-w-2xl font-semibold text-white/90">
                            Monitor content and learning activity across the platform.
                        </p>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div className="rounded-3xl bg-red-50 p-4 font-bold text-red-500">
                    {errorMessage}
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <article
                            key={card.label}
                            className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div
                                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}
                            >
                                <Icon className="h-7 w-7" />
                            </div>
                            <p className="text-sm font-black text-slate-400">
                                {card.label}
                            </p>
                            <p className="mt-1 text-4xl font-black text-slate-900">
                                {card.value}
                            </p>
                        </article>
                    );
                })}
            </section>

            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-black text-slate-900">
                    Admin Scope
                </h2>
                <p className="mt-2 max-w-3xl font-semibold text-slate-500">
                    This page is protected by Spring Security. Only users with the
                    ADMIN role can access `/api/admin/**` and the admin route.
                </p>
            </section>
        </div>
    );
}

export default AdminDashboard;
