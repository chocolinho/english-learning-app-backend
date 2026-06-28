import { useEffect, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { getMyWrongAnswers, resolveWrongAnswer } from "../services/wrongAnswerService";

function ReviewWrongAnswers() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchWrongAnswers = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            setItems(await getMyWrongAnswers());
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load wrong answers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchWrongAnswers();
    }, []);

    const handleResolve = async (id) => {
        await resolveWrongAnswer(id);
        setItems((current) => current.filter((item) => item.id !== id));
    };

    if (loading) {
        return <p className="font-black text-slate-500">Loading review list...</p>;
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <section className="rounded-[2rem] bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 p-6 text-white md:p-8">
                <h1 className="text-3xl font-black md:text-5xl">Review Mistakes</h1>
                <p className="mt-3 font-semibold text-white/90">
                    Practice words you answered incorrectly.
                </p>
            </section>

            {errorMessage && (
                <div className="rounded-3xl bg-red-50 p-4 font-bold text-red-500">
                    {errorMessage}
                </div>
            )}

            {items.length === 0 ? (
                <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
                    <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#58CC02]" />
                    <h2 className="text-2xl font-black text-slate-900">All clear</h2>
                    <p className="mt-2 font-semibold text-slate-500">
                        No unresolved wrong answers yet.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {items.map((item) => (
                        <article
                            key={item.id}
                            className="rounded-[1.75rem] border border-red-100 bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        <h2 className="text-2xl font-black text-slate-900">
                                            {item.vocabulary.word}
                                        </h2>
                                    </div>
                                    <p className="mt-2 font-semibold text-slate-500">
                                        Correct:{" "}
                                        <span className="font-black text-[#58CC02]">
                                            {item.vocabulary.meaning}
                                        </span>
                                    </p>
                                    <p className="text-sm font-semibold text-slate-400">
                                        Last answer: {item.lastSubmittedAnswer || "N/A"} · Mistakes:{" "}
                                        {item.mistakeCount}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleResolve(item.id)}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-5 py-3 font-black text-white"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                    Mark Reviewed
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReviewWrongAnswers;
