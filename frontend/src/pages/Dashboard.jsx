import { useEffect, useState } from "react";
import {
    getTopics,
    getVocabularies,
    getQuizResults,
} from "../services/dashboardService";

function Dashboard() {
    const [stats, setStats] = useState({
        topics: 0,
        vocabularies: 0,
        quizResults: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [topics, vocabularies, quizResults] = await Promise.all([
                    getTopics(),
                    getVocabularies(),
                    getQuizResults(),
                ]);

                setStats({
                    topics: topics.length,
                    vocabularies: vocabularies.length,
                    quizResults: quizResults.length,
                });
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-slate-500">Topics</p>
                    <h2 className="text-4xl font-bold mt-2">
                        {stats.topics}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-slate-500">Vocabularies</p>
                    <h2 className="text-4xl font-bold mt-2">
                        {stats.vocabularies}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-slate-500">Quiz Results</p>
                    <h2 className="text-4xl font-bold mt-2">
                        {stats.quizResults}
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;