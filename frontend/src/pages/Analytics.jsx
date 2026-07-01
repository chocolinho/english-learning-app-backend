import { useEffect, useState } from "react";
import {
    BarChart3,
    BookOpen,
    CheckCircle2,
    Flame,
    Heart,
    Target,
    Trophy,
    XCircle,
} from "lucide-react";
import PageSkeleton from "../components/PageSkeleton";
import { getMyAnalytics } from "../services/analyticsService";

function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setErrorMessage("");
                setAnalytics(await getMyAnalytics());
            } catch (error) {
                console.error(error);
                setErrorMessage("Could not load your analytics right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    const cards = [
        {
            label: "Total XP",
            value: analytics?.totalXp ?? 0,
            helper: `Level ${analytics?.currentLevel ?? 1}`,
            icon: Trophy,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            label: "Quiz Attempts",
            value: analytics?.totalQuizAttempts ?? 0,
            helper: `${analytics?.averageScore ?? 0}% average`,
            icon: Target,
            color: "bg-sky-100 text-[#1CB0F6]",
        },
        {
            label: "Correct Answers",
            value: analytics?.totalCorrectAnswers ?? 0,
            helper: `${analytics?.totalWrongAnswers ?? 0} wrong answers`,
            icon: CheckCircle2,
            color: "bg-green-100 text-[#58CC02]",
        },
        {
            label: "Favorites",
            value: analytics?.favoriteVocabularyCount ?? 0,
            helper: `${analytics?.reviewedWrongAnswerCount ?? 0} mistakes resolved`,
            icon: Heart,
            color: "bg-pink-100 text-pink-500",
        },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-[2rem] bg-gradient-to-br from-[#58CC02] via-[#1CB0F6] to-[#CE82FF] p-6 text-white shadow-xl shadow-sky-100 md:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black">
                            <BarChart3 className="h-4 w-4" />
                            Learning analytics
                        </div>
                        <h1 className="text-3xl font-black md:text-5xl">
                            Your progress, clearer than ever.
                        </h1>
                        <p className="mt-3 max-w-2xl font-semibold text-white/90">
                            Track quiz performance, level growth, topic progress, and review habits from backend data.
                        </p>
                    </div>

                    <div className="rounded-[1.75rem] bg-white/20 p-5 backdrop-blur lg:min-w-72">
                        <p className="text-sm font-black text-white/75">Level Progress</p>
                        <p className="mt-1 text-5xl font-black">
                            {analytics?.levelProgress ?? 0}%
                        </p>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/25">
                            <div
                                className="h-full rounded-full bg-white transition-all duration-700"
                                style={{ width: `${analytics?.levelProgress ?? 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div className="rounded-3xl bg-red-50 p-4 font-bold text-red-500">
                    {errorMessage}
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <MetricCard key={card.label} {...card} />
                ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel
                    title="Performance"
                    description="Best score, average score, and daily consistency."
                    icon={<Flame className="h-6 w-6" />}
                >
                    <div className="grid gap-3 sm:grid-cols-3">
                        <MiniStat label="Best Score" value={`${analytics?.bestScore ?? 0}%`} />
                        <MiniStat label="Average" value={`${analytics?.averageScore ?? 0}%`} />
                        <MiniStat label="Daily Streak" value={analytics?.dailyStreak ?? 0} />
                    </div>
                </Panel>

                <Panel
                    title="Recent Quiz Scores"
                    description="Latest completed quiz attempts."
                    icon={<Target className="h-6 w-6" />}
                >
                    <div className="space-y-3">
                        {(analytics?.recentQuizScores ?? []).length === 0 ? (
                            <EmptyState text="No quiz attempts yet." />
                        ) : (
                            analytics.recentQuizScores.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-black text-slate-900">
                                            {quiz.topicName}
                                        </p>
                                        <p className="text-sm font-bold text-slate-400">
                                            {quiz.correctAnswers}/{quiz.totalQuestions} correct
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-[#1CB0F6]">
                                        {quiz.score}%
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Panel>
            </section>

            <Panel
                title="Topic Progress"
                description="Vocabulary practice grouped by topic."
                icon={<BookOpen className="h-6 w-6" />}
            >
                <div className="grid gap-4 lg:grid-cols-2">
                    {(analytics?.topicProgressSummary ?? []).length === 0 ? (
                        <EmptyState text="Review vocabulary to build topic analytics." />
                    ) : (
                        analytics.topicProgressSummary.map((topic) => (
                            <article
                                key={topic.topicId}
                                className="rounded-3xl bg-slate-50 p-4"
                            >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate font-black text-slate-900">
                                            {topic.topicName}
                                        </h3>
                                        <p className="text-sm font-bold text-slate-400">
                                            {topic.masteredWords}/{topic.reviewedWords} mastered
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-[#58CC02]">
                                        {topic.accuracy}%
                                    </span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-white">
                                    <div
                                        className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                                        style={{ width: `${topic.accuracy}%` }}
                                    />
                                </div>
                                <div className="mt-3 flex items-center gap-4 text-sm font-black">
                                    <span className="inline-flex items-center gap-1 text-[#58CC02]">
                                        <CheckCircle2 className="h-4 w-4" />
                                        {topic.correctAnswers}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-red-400">
                                        <XCircle className="h-4 w-4" />
                                        {topic.wrongAnswers}
                                    </span>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </Panel>
        </div>
    );
}

function MetricCard({ label, value, helper, icon: Icon, color }) {
    return (
        <article className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="h-7 w-7" />
            </div>
            <p className="text-sm font-black text-slate-400">{label}</p>
            <p className="mt-1 text-4xl font-black text-slate-900">{value}</p>
            <p className="mt-1 text-sm font-bold text-slate-500">{helper}</p>
        </article>
    );
}

function Panel({ title, description, icon, children }) {
    return (
        <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-[#1CB0F6]">
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900">{title}</h2>
                    <p className="mt-1 font-semibold text-slate-500">{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

function MiniStat({ label, value }) {
    return (
        <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-3xl font-black text-slate-900">{value}</p>
            <p className="text-sm font-black text-slate-400">{label}</p>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="rounded-3xl bg-slate-50 p-6 text-center font-black text-slate-400">
            {text}
        </div>
    );
}

export default Analytics;
