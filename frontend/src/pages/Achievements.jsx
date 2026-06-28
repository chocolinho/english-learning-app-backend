import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Flame, Lock, Star, TrendingUp, Trophy } from "lucide-react";
import { getMyAchievements } from "../services/achievementService";

const iconMap = {
    Trophy,
    Star,
    TrendingUp,
    BadgeCheck,
    Flame,
};

function Achievements() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setLoading(true);
                setErrorMessage("");
                setAchievements(await getMyAchievements());
            } catch (error) {
                console.error(error);
                setErrorMessage("Failed to load achievements.");
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    const unlockedCount = useMemo(
        () => achievements.filter((achievement) => achievement.unlocked).length,
        [achievements]
    );

    if (loading) {
        return <p className="font-black text-slate-500">Loading achievements...</p>;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="rounded-[2rem] bg-gradient-to-br from-yellow-400 via-[#58CC02] to-[#1CB0F6] p-6 text-white md:p-8">
                <h1 className="text-3xl font-black md:text-5xl">Achievements</h1>
                <p className="mt-3 font-semibold text-white/90">
                    {unlockedCount} / {achievements.length} badges unlocked.
                </p>
            </section>

            {errorMessage && (
                <div className="rounded-3xl bg-red-50 p-4 font-bold text-red-500">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {achievements.map((achievement) => {
                    const Icon = achievement.unlocked
                        ? iconMap[achievement.icon] || Trophy
                        : Lock;

                    return (
                        <article
                            key={achievement.code}
                            className={`rounded-[1.75rem] border p-5 shadow-sm transition-all ${
                                achievement.unlocked
                                    ? "border-green-100 bg-white hover:-translate-y-1 hover:shadow-xl"
                                    : "border-slate-100 bg-slate-50 opacity-70"
                            }`}
                        >
                            <div
                                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-3xl ${
                                    achievement.unlocked
                                        ? "bg-yellow-100 text-yellow-500"
                                        : "bg-slate-100 text-slate-400"
                                }`}
                            >
                                <Icon className="h-8 w-8" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">
                                {achievement.title}
                            </h2>
                            <p className="mt-2 text-sm font-semibold text-slate-500">
                                {achievement.description}
                            </p>
                            <p className="mt-4 text-xs font-black uppercase text-slate-400">
                                {achievement.unlocked ? "Unlocked" : "Locked"}
                            </p>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

export default Achievements;
