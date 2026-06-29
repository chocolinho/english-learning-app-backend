import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
    ChevronRight,
    RotateCcw,
    Target,
    Volume2,
    XCircle,
} from "lucide-react";
import {
    getWrongAnswerPracticeItems,
    submitWrongAnswerPractice,
} from "../services/wrongAnswerService";
import PageSkeleton from "../components/PageSkeleton";

function ReviewWrongAnswers() {
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const currentItem = items[currentIndex];
    const progress = useMemo(
        () =>
            items.length > 0
                ? Math.round(((currentIndex + 1) / items.length) * 100)
                : 0,
        [currentIndex, items.length]
    );

    const fetchPracticeItems = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const data = await getWrongAnswerPracticeItems();
            setItems(data);
            setCurrentIndex(0);
            setAnswer("");
            setFeedback(null);
            setCompleted(false);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load review practice.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPracticeItems();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!answer.trim() || !currentItem) return;

        try {
            setSubmitting(true);
            setErrorMessage("");

            const response = await submitWrongAnswerPractice({
                wrongAnswerId: currentItem.id,
                answer: answer.trim(),
            });

            setFeedback(response);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not submit your answer.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = () => {
        const isLast = currentIndex === items.length - 1;

        if (isLast) {
            setCompleted(true);
            return;
        }

        setCurrentIndex((previous) => previous + 1);
        setAnswer("");
        setFeedback(null);
    };

    const speak = () => {
        if (!currentItem?.vocabulary?.word || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentItem.vocabulary.word);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    if (loading) {
        return <PageSkeleton />;
    }

    if (completed) {
        return (
            <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-green-50 text-[#58CC02]">
                    <CheckCircle2 className="h-11 w-11" />
                </div>
                <h1 className="text-4xl font-black text-slate-900">
                    Review Complete
                </h1>
                <p className="mt-3 font-semibold text-slate-500">
                    You practiced {items.length} mistake words.
                </p>
                <button
                    type="button"
                    onClick={fetchPracticeItems}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-6 py-4 font-black text-white shadow-lg shadow-green-100"
                >
                    <RotateCcw className="h-5 w-5" />
                    Practice Again
                </button>
            </div>
        );
    }

    if (!currentItem) {
        return (
            <div className="mx-auto max-w-3xl space-y-6">
                <section className="rounded-[2rem] bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 p-6 text-white md:p-8">
                    <h1 className="text-3xl font-black md:text-5xl">
                        Review Practice
                    </h1>
                    <p className="mt-3 font-semibold text-white/90">
                        Practice words you answered incorrectly.
                    </p>
                </section>
                <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
                    <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#58CC02]" />
                    <h2 className="text-2xl font-black text-slate-900">
                        All clear
                    </h2>
                    <p className="mt-2 font-semibold text-slate-500">
                        No unresolved wrong answers yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <section className="rounded-[2rem] bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 p-6 text-white md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black md:text-5xl">
                            Review Practice
                        </h1>
                        <p className="mt-3 font-semibold text-white/90">
                            Fix mistakes by answering again.
                        </p>
                    </div>
                    <div className="rounded-3xl bg-white/20 px-5 py-4 font-black">
                        {currentIndex + 1} / {items.length}
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div className="rounded-3xl bg-red-50 p-4 font-bold text-red-500">
                    {errorMessage}
                </div>
            )}

            <div>
                <div className="mb-3 flex items-center justify-between">
                    <p className="font-black text-slate-500">Progress</p>
                    <p className="font-black text-[#58CC02]">{progress}%</p>
                </div>
                <div
                    className="h-4 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label="Review practice progress"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8"
            >
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-black text-slate-400">
                            Type the correct meaning
                        </p>
                        <h2 className="mt-2 break-words text-5xl font-black text-slate-900">
                            {currentItem.vocabulary.word}
                        </h2>
                        <p className="mt-3 text-sm font-semibold text-slate-500">
                            Last answer: {currentItem.lastSubmittedAnswer || "N/A"} · Mistakes:{" "}
                            {currentItem.mistakeCount}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={speak}
                        className="rounded-2xl bg-blue-50 p-3 text-[#1CB0F6]"
                        aria-label="Pronounce word"
                    >
                        <Volume2 className="h-5 w-5" />
                    </button>
                </div>

                <label
                    htmlFor="review-answer"
                    className="block text-sm font-black text-slate-600"
                >
                    Your answer
                </label>
                <input
                    id="review-answer"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    disabled={Boolean(feedback)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold outline-none transition-all focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 disabled:text-slate-400"
                    placeholder="Enter meaning"
                    autoComplete="off"
                />

                {feedback && (
                    <div
                        role="status"
                        aria-live="polite"
                        className={`mt-5 rounded-3xl p-4 font-bold ${
                            feedback.correct
                                ? "bg-green-50 text-[#58CC02]"
                                : "bg-red-50 text-red-500"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {feedback.correct ? (
                                <CheckCircle2 className="h-5 w-5" />
                            ) : (
                                <XCircle className="h-5 w-5" />
                            )}
                            {feedback.correct
                                ? "Correct. This word is resolved."
                                : `Not yet. Correct answer: ${feedback.correctAnswer}`}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {!feedback ? (
                        <button
                            type="submit"
                            disabled={!answer.trim() || submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-6 py-4 font-black text-white shadow-lg shadow-green-100 transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Target className="h-5 w-5" />
                            {submitting ? "Checking..." : "Check Answer"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1CB0F6] px-6 py-4 font-black text-white shadow-lg shadow-sky-100 transition-all hover:-translate-y-1"
                        >
                            {currentIndex === items.length - 1 ? "Finish" : "Next"}
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default ReviewWrongAnswers;
