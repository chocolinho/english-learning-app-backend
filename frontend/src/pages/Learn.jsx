import { BookOpen, PlayCircle } from "lucide-react";

function Learn() {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#58CC02] to-[#1CB0F6] rounded-[2rem] p-8 text-white">
                <h1 className="text-4xl font-black">
                    Start Learning
                </h1>

                <p className="text-white/90 mt-3 max-w-xl">
                    Choose a lesson, learn vocabulary with flashcards, and
                    practice with fun quizzes.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
                {["Animals", "Food", "School"].map((lesson) => (
                    <div
                        key={lesson}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-green-100 text-[#58CC02] flex items-center justify-center mb-4">
                            <BookOpen className="w-7 h-7" />
                        </div>

                        <h3 className="text-xl font-black text-slate-800">
                            {lesson}
                        </h3>

                        <p className="text-slate-500 text-sm mt-2">
                            Learn beginner English vocabulary.
                        </p>

                        <button className="mt-5 flex items-center gap-2 bg-[#58CC02] text-white px-5 py-3 rounded-2xl font-black">
                            <PlayCircle className="w-5 h-5" />
                            Start
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Learn;