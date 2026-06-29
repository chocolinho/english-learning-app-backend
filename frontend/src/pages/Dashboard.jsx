import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getTopics,
    getVocabularies,
    getMyQuizResults,
} from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import LearningCard from "../components/LearningCard";
import ProgressCard from "../components/ProgressCard";
import BadgeCard from "../components/BadgeCard";
import {
    Star,
    BookOpen,
    Brain,
    Crown,
    FileText,
    Trophy,
    Target,
    Flame,
    Lock,
    Rocket,
    PawPrint,
    Utensils,
    Plane,
    School,
    Users,
    Dumbbell,
} from "lucide-react";

function Dashboard() {
    const { user, isPremium } = useAuth();

    const displayName =
        user?.name ||
        user?.fullName ||
        user?.username ||
        user?.email ||
        "Learner";

    const [stats, setStats] = useState({
        topics: 0,
        vocabularies: 0,
        quizResults: 0,
        averageScore: "0.0",
        bestScore: "0.0",
        xpPoints: 0,
        level: 1,
        levelProgress: 0,
        nextLevelXp: 100,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [topics, vocabularies, quizResults] = await Promise.all([
                    getTopics(),
                    getVocabularies(),
                    getMyQuizResults(),
                ]);

                const quizCount = quizResults.length;

                const averageScore =
                    quizCount > 0
                        ? quizResults.reduce(
                            (sum, item) => sum + Number(item.score || 0),
                            0
                        ) / quizCount
                        : 0;

                const bestScore =
                    quizCount > 0
                        ? Math.max(
                            ...quizResults.map((item) =>
                                Number(item.score || 0)
                            )
                        )
                        : 0;

                setStats({
                    topics: topics.length,
                    vocabularies: vocabularies.length,
                    quizResults: quizCount,
                    averageScore: averageScore.toFixed(1),
                    bestScore: bestScore.toFixed(1),
                    xpPoints: user?.xp || 0,
                    level: user?.level || 1,
                    levelProgress: user?.levelProgress || 0,
                    nextLevelXp: user?.nextLevelXp || 100,
                });
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const recommendedTopics = [
        {
            icon: <PawPrint size={32} />,
            title: "Animals",
            description: "Learn animal vocabulary",
            progress: 70,
            color: "bg-green-100",
        },
        {
            icon: <Utensils size={32} />,
            title: "Food",
            description: "Practice food words",
            progress: 45,
            color: "bg-yellow-100",
        },
        {
            icon: <Plane size={32} />,
            title: "Travel",
            description: "Useful travel English",
            progress: 30,
            color: "bg-blue-100",
        },
        {
            icon: <School size={32} />,
            title: "School",
            description: "Classroom vocabulary",
            progress: 55,
            color: "bg-purple-100",
        },
        {
            icon: <Users size={32} />,
            title: "Family",
            description: "Family member words",
            progress: 80,
            color: "bg-orange-100",
        },
        {
            icon: <Dumbbell size={32} />,
            title: "Sports",
            description: "Learn sports vocabulary",
            progress: 25,
            color: "bg-sky-100",
        },
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="flex justify-center mb-4 animate-bounce">
                        <Rocket size={56} className="text-[#58CC02]" />
                    </div>

                    <p className="text-slate-500 font-bold">
                        Loading your learning world...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="bg-gradient-to-r from-[#58CC02] to-[#1CB0F6] rounded-[2rem] p-6 md:p-8 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10 max-w-2xl">
                    <p className="text-white/80 font-bold mb-2">
                        Welcome back, {displayName}
                    </p>

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black">
                        <Crown className="h-4 w-4" />
                        {isPremium ? "Premium Plan" : "Free Plan"}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black leading-tight">
                        Ready to learn English today?
                    </h1>

                    <p className="mt-4 text-white/90 text-lg">
                        Keep your streak alive and unlock new achievements.
                    </p>

                    <a
                        href="/quiz"
                        className="inline-block mt-6 bg-white text-[#58CC02] px-8 py-4 rounded-2xl font-black shadow-md hover:scale-105 transition-all"
                    >
                        Continue Learning
                    </a>
                </div>

                <div className="absolute right-8 bottom-8 opacity-30">
                    <Rocket size={120} />
                </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    icon={<Star size={28} />}
                    title="XP Points"
                    value={stats.xpPoints}
                    subtitle="total experience"
                    color="bg-yellow-100"
                />

                <StatCard
                    icon={<BookOpen size={28} />}
                    title="Topics"
                    value={stats.topics}
                    subtitle="learning topics"
                    color="bg-blue-100"
                />

                <StatCard
                    icon={<Brain size={28} />}
                    title="Words"
                    value={stats.vocabularies}
                    subtitle="vocabulary learned"
                    color="bg-purple-100"
                />

                <StatCard
                    icon={<FileText size={28} />}
                    title="Quiz Attempts"
                    value={stats.quizResults}
                    subtitle="completed quizzes"
                    color="bg-green-100"
                />
            </section>

            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-bold text-slate-400">
                            Current Level
                        </p>

                        <h3 className="text-3xl font-black text-slate-800">
                            Level {stats.level}
                        </h3>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-500">
                        <Trophy size={30} />
                    </div>
                </div>

                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#58CC02] rounded-full transition-all duration-500"
                        style={{ width: `${stats.levelProgress}%` }}
                    ></div>
                </div>

                <p className="text-sm text-slate-500 font-bold mt-3">
                    {stats.xpPoints} / {stats.nextLevelXp} XP to next level
                </p>
            </section>

            <section
                className={`rounded-[1.75rem] border p-6 shadow-sm ${
                    isPremium
                        ? "border-yellow-100 bg-yellow-50"
                        : "border-slate-100 bg-white"
                }`}
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl ${
                                isPremium
                                    ? "bg-white text-yellow-500"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                        >
                            {isPremium ? (
                                <Crown className="h-7 w-7" />
                            ) : (
                                <Lock className="h-7 w-7" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                {isPremium
                                    ? "Premium learning unlocked"
                                    : "Upgrade your learning toolkit"}
                            </h2>
                            <p className="mt-2 max-w-3xl font-semibold text-slate-500">
                                {isPremium
                                    ? "You can access premium topics, longer quizzes, AI features, and export tools."
                                    : "Premium unlocks longer quizzes, premium topics, AI features, and vocabulary export."}
                            </p>
                        </div>
                    </div>

                    {!isPremium && (
                        <Link
                            to="/premium"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-4 font-black text-slate-900 shadow-lg shadow-yellow-100 transition-all hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-100"
                        >
                            <Crown className="h-5 w-5" />
                            View Premium
                        </Link>
                    )}
                </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <ProgressCard
                        title="Weekly Learning Goal"
                        value={stats.quizResults}
                        target={7}
                    />
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-2">
                        Quiz Performance
                    </h3>

                    <p className="text-slate-500 text-sm mb-4">
                        Your average and best quiz score
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-bold text-slate-400">
                                Average
                            </p>
                            <div className="flex items-end gap-1">
                                <span className="text-4xl font-black text-[#58CC02]">
                                    {stats.averageScore}
                                </span>
                                <span className="text-slate-400 font-bold mb-1">
                                    %
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-400">
                                Best
                            </p>
                            <div className="flex items-end gap-1">
                                <span className="text-4xl font-black text-[#1CB0F6]">
                                    {stats.bestScore}
                                </span>
                                <span className="text-slate-400 font-bold mb-1">
                                    %
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">
                            Recommended Lessons
                        </h2>
                        <p className="text-slate-500">
                            Choose a topic and start learning.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {recommendedTopics.map((topic) => (
                        <LearningCard
                            key={topic.title}
                            icon={topic.icon}
                            title={topic.title}
                            description={topic.description}
                            progress={topic.progress}
                            color={topic.color}
                        />
                    ))}
                </div>
            </section>

            <section>
                <div className="mb-5">
                    <h2 className="text-2xl font-black text-slate-800">
                        Achievements
                    </h2>
                    <p className="text-slate-500">
                        Your learning milestones.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <BadgeCard
                        icon={<Flame size={30} />}
                        title="Streak Starter"
                        description="Complete your first weekly learning goal"
                        color="bg-orange-100"
                    />

                    <BadgeCard
                        icon={<BookOpen size={30} />}
                        title="Word Collector"
                        description="Build your vocabulary collection"
                        color="bg-blue-100"
                    />

                    <BadgeCard
                        icon={<Target size={30} />}
                        title="Quiz Beginner"
                        description="Complete your first quiz"
                        color="bg-green-100"
                    />
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
