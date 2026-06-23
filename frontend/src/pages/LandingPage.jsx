import { Link } from "react-router-dom";
import {
    BookOpen,
    Brain,
    Trophy,
    Flame,
    Star,
    PlayCircle,
    CheckCircle,
    Sparkles,
} from "lucide-react";

function LandingPage() {
    const features = [
        {
            icon: BookOpen,
            title: "Vocabulary Cards",
            description: "Learn English words with colorful flashcards.",
            color: "bg-green-100 text-[#58CC02]",
        },
        {
            icon: Brain,
            title: "Fun Quizzes",
            description: "Practice with simple quizzes and instant feedback.",
            color: "bg-blue-100 text-[#1CB0F6]",
        },
        {
            icon: Trophy,
            title: "XP & Badges",
            description: "Earn rewards, badges, and keep your streak alive.",
            color: "bg-yellow-100 text-[#FF9600]",
        },
    ];

    const topics = [
        "Animals",
        "Food",
        "School",
        "Family",
        "Travel",
        "Sports",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-sky-50 to-yellow-50">
            <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#58CC02] flex items-center justify-center shadow-md">
                        <BookOpen className="w-7 h-7 text-white" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-black text-slate-800">
                            LinguaKid
                        </h1>
                        <p className="text-xs font-bold text-slate-400">
                            English Learning Platform
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="font-bold text-slate-600 hover:text-[#58CC02]"
                    >
                        Login
                    </Link>

                    <Link
                        to="/login"
                        className="bg-[#58CC02] text-white px-5 py-3 rounded-2xl font-black shadow-md hover:scale-105 transition-all"
                    >
                        Start Learning
                    </Link>
                </div>
            </header>

            <main>
                <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-[#58CC02] font-black mb-6">
                            <Sparkles className="w-5 h-5" />
                            Fun English for beginner learners
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-slate-800 leading-tight">
                            Learn English
                            <span className="block text-[#58CC02]">
                                the fun way
                            </span>
                        </h2>

                        <p className="text-lg text-slate-500 mt-6 max-w-xl leading-relaxed">
                            Colorful lessons, vocabulary cards, quizzes, XP
                            rewards, and achievements designed for children and
                            beginner English learners.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link
                                to="/login"
                                className="bg-[#58CC02] text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <PlayCircle className="w-5 h-5" />
                                Get Started
                            </Link>

                            <Link
                                to="/login"
                                className="bg-white text-slate-700 px-8 py-4 rounded-2xl font-black shadow-md hover:scale-105 transition-all"
                            >
                                I already have account
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
                            <div className="bg-white rounded-3xl p-4 shadow-sm">
                                <Flame className="w-7 h-7 text-orange-500 mb-2" />
                                <p className="text-2xl font-black">3+</p>
                                <p className="text-xs text-slate-400 font-bold">
                                    Day streak
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-4 shadow-sm">
                                <Star className="w-7 h-7 text-yellow-500 mb-2" />
                                <p className="text-2xl font-black">120+</p>
                                <p className="text-xs text-slate-400 font-bold">
                                    XP points
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-4 shadow-sm">
                                <Trophy className="w-7 h-7 text-purple-500 mb-2" />
                                <p className="text-2xl font-black">8+</p>
                                <p className="text-xs text-slate-400 font-bold">
                                    Badges
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-white">
                            <div className="bg-gradient-to-br from-[#58CC02] to-[#1CB0F6] rounded-[2.5rem] p-8 text-white">
                                <div className="w-24 h-24 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-6">
                                    <BookOpen className="w-12 h-12 text-white" />
                                </div>

                                <h3 className="text-3xl font-black text-center">
                                    Today's Lesson
                                </h3>

                                <p className="text-center text-white/90 mt-2">
                                    Animals Vocabulary
                                </p>

                                <div className="bg-white/20 rounded-3xl p-5 mt-8">
                                    <p className="text-sm font-bold text-white/80">
                                        New word
                                    </p>
                                    <h4 className="text-5xl font-black mt-2">
                                        Cat
                                    </h4>
                                    <p className="mt-2 text-white/90">
                                        A small animal that says meow.
                                    </p>
                                </div>

                                <button className="w-full bg-white text-[#58CC02] rounded-2xl py-4 font-black mt-6">
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-slate-800">
                            Why learners love LinguaKid
                        </h2>
                        <p className="text-slate-500 mt-3">
                            Simple, colorful, and rewarding English practice.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="bg-white rounded-3xl p-7 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all"
                                >
                                    <div
                                        className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-5 ${feature.color}`}
                                    >
                                        <Icon className="w-8 h-8" />
                                    </div>

                                    <h3 className="text-xl font-black text-slate-800">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-500 mt-2">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-6 py-12">
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                            <div>
                                <h2 className="text-3xl font-black text-slate-800">
                                    Popular Topics
                                </h2>
                                <p className="text-slate-500">
                                    Start with simple topics for beginners.
                                </p>
                            </div>

                            <CheckCircle className="w-10 h-10 text-[#58CC02]" />
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
                            {topics.map((topic) => (
                                <div
                                    key={topic}
                                    className="bg-slate-50 rounded-3xl p-5 text-center font-black text-slate-700 hover:bg-[#58CC02] hover:text-white hover:-translate-y-1 transition-all"
                                >
                                    {topic}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default LandingPage;