import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    AlertCircle,
    CheckCircle2,
    Crown,
    Loader2,
    Lock,
    Sparkles,
    WandSparkles,
} from "lucide-react";
import PageSkeleton from "../components/PageSkeleton";
import { useAuth } from "../context/AuthContext";
import { generateAiQuestions } from "../services/aiQuestionService";
import { getTopics } from "../services/topicService";

const questionCounts = [5, 10, 20, 30];
const difficulties = ["EASY", "MEDIUM", "HARD"];
const questionTypes = ["MULTIPLE_CHOICE"];

function AiQuestionGenerator() {
    const { isPremium, isAdmin } = useAuth();
    const hasAiAccess = isPremium || isAdmin;
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState("");
    const [questionCount, setQuestionCount] = useState(5);
    const [difficulty, setDifficulty] = useState("EASY");
    const [questionType, setQuestionType] = useState("MULTIPLE_CHOICE");
    const [result, setResult] = useState(null);
    const [loadingTopics, setLoadingTopics] = useState(hasAiAccess);
    const [generating, setGenerating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!hasAiAccess) {
            return;
        }

        const fetchTopics = async () => {
            try {
                setLoadingTopics(true);
                setErrorMessage("");
                const topicData = await getTopics();
                setTopics(topicData);

                const firstAvailableTopic = topicData.find(
                    (topic) => !topic.locked && (topic.vocabularyCount ?? 0) >= 4
                );
                setSelectedTopicId(firstAvailableTopic?.id?.toString() || "");
            } catch (error) {
                console.error(error);
                setErrorMessage("Could not load topics for AI generation.");
            } finally {
                setLoadingTopics(false);
            }
        };

        fetchTopics();
    }, [hasAiAccess]);

    const availableTopics = useMemo(
        () => topics.filter((topic) => !topic.locked),
        [topics]
    );

    const selectedTopic = availableTopics.find(
        (topic) => Number(topic.id) === Number(selectedTopicId)
    );

    const handleGenerate = async (event) => {
        event.preventDefault();

        if (!selectedTopicId) {
            setErrorMessage("Please choose a topic with at least 4 words.");
            return;
        }

        try {
            setGenerating(true);
            setErrorMessage("");
            setResult(null);
            const response = await generateAiQuestions({
                topicId: Number(selectedTopicId),
                questionCount,
                difficulty,
                questionType,
            });
            setResult(response);
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.response?.data?.message ||
                    "Could not generate AI questions right now."
            );
        } finally {
            setGenerating(false);
        }
    };

    if (!hasAiAccess) {
        return <LockedAiState />;
    }

    if (loadingTopics) {
        return <PageSkeleton variant="dashboard" />;
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#CE82FF] via-[#1CB0F6] to-[#58CC02] p-6 text-white shadow-xl shadow-purple-100 md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black">
                            <WandSparkles className="h-4 w-4" />
                            Premium AI Lab
                        </div>
                        <h1 className="max-w-3xl text-3xl font-black md:text-5xl">
                            Generate quiz questions from your vocabulary.
                        </h1>
                        <p className="mt-3 max-w-2xl font-semibold text-white/90">
                            Pick a backend topic and create practice-ready multiple choice questions from real words.
                        </p>
                    </div>

                    <div className="rounded-[1.75rem] bg-white/20 p-5 backdrop-blur lg:min-w-72">
                        <p className="text-sm font-black text-white/75">
                            Available Topics
                        </p>
                        <p className="mt-1 text-5xl font-black">
                            {availableTopics.length}
                        </p>
                        <p className="mt-2 font-bold text-white/85">
                            Topic needs at least 4 usable words.
                        </p>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div className="flex items-center gap-3 rounded-3xl bg-red-50 p-4 font-bold text-red-500">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    {errorMessage}
                </div>
            )}

            <section className="grid gap-5 xl:grid-cols-[390px_1fr]">
                <form
                    onSubmit={handleGenerate}
                    className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm"
                >
                    <h2 className="text-2xl font-black text-slate-900">
                        Generator Settings
                    </h2>
                    <p className="mt-1 font-semibold text-slate-500">
                        These controls call the secured AI endpoint only when you click generate.
                    </p>

                    <label
                        htmlFor="ai-topic"
                        className="mt-5 block text-sm font-black text-slate-600"
                    >
                        Topic
                    </label>
                    <select
                        id="ai-topic"
                        value={selectedTopicId}
                        onChange={(event) => setSelectedTopicId(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none transition-all focus:border-[#58CC02] focus:ring-4 focus:ring-green-100"
                    >
                        <option value="">Choose topic</option>
                        {topics.map((topic) => {
                            const disabled = topic.locked || (topic.vocabularyCount ?? 0) < 4;
                            return (
                                <option
                                    key={topic.id}
                                    value={topic.id}
                                    disabled={disabled}
                                >
                                    {topic.name} - {topic.vocabularyCount ?? 0} words
                                    {topic.locked ? " - locked" : ""}
                                </option>
                            );
                        })}
                    </select>

                    <SegmentedControl
                        label="Questions"
                        value={questionCount}
                        options={questionCounts}
                        onChange={setQuestionCount}
                    />

                    <SegmentedControl
                        label="Difficulty"
                        value={difficulty}
                        options={difficulties}
                        onChange={setDifficulty}
                    />

                    <SegmentedControl
                        label="Question Type"
                        value={questionType}
                        options={questionTypes}
                        onChange={setQuestionType}
                    />

                    <button
                        type="submit"
                        disabled={generating || !selectedTopicId}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-6 py-4 font-black text-white shadow-lg shadow-green-100 transition-all hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {generating ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <WandSparkles className="h-5 w-5" />
                        )}
                        {generating ? "Generating..." : "Generate Questions"}
                    </button>

                    {selectedTopic && (
                        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
                            <p className="text-sm font-black text-slate-400">
                                Selected Topic
                            </p>
                            <p className="mt-1 font-black text-slate-900">
                                {selectedTopic.name}
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-500">
                                {selectedTopic.vocabularyCount ?? 0} vocabulary words
                            </p>
                        </div>
                    )}
                </form>

                <section className="space-y-4">
                    {!result ? (
                        <div className="flex min-h-[420px] items-center justify-center rounded-[1.75rem] border border-dashed border-slate-200 bg-white p-8 text-center">
                            <div>
                                <Sparkles className="mx-auto mb-4 h-14 w-14 text-purple-300" />
                                <h2 className="text-2xl font-black text-slate-900">
                                    Generated questions will appear here.
                                </h2>
                                <p className="mt-2 max-w-xl font-semibold text-slate-500">
                                    The generator uses real topic vocabulary and returns preview cards without changing existing quiz results.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-black text-slate-400">
                                            Generated Set
                                        </p>
                                        <h2 className="text-2xl font-black text-slate-900">
                                            {result.topicName}
                                        </h2>
                                    </div>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-black text-[#58CC02]">
                                        <CheckCircle2 className="h-4 w-4" />
                                        {result.questionCount} questions
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {result.questions.map((question, index) => (
                                    <QuestionPreview
                                        key={`${question.vocabularyId}-${index}`}
                                        question={question}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </section>
        </div>
    );
}

function LockedAiState() {
    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <section
                className="rounded-[2rem] border border-yellow-100 bg-white p-8 text-center shadow-sm"
                role="region"
                aria-labelledby="ai-locked-title"
            >
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-yellow-100 text-yellow-600">
                    <Lock className="h-10 w-10" />
                </div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-black text-yellow-700">
                    <Crown className="h-4 w-4" />
                    Premium required
                </div>
                <h1
                    id="ai-locked-title"
                    className="text-3xl font-black text-slate-900 md:text-5xl"
                >
                    Unlock AI Question Generator.
                </h1>
                <p className="mx-auto mt-3 max-w-2xl font-semibold leading-relaxed text-slate-500">
                    Premium users can generate quiz questions from real vocabulary, preview answers, and prepare richer practice sets.
                </p>
                <Link
                    to="/premium"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-4 font-black text-slate-900 shadow-lg shadow-yellow-100 transition-all hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-100"
                >
                    <Crown className="h-5 w-5" />
                    Upgrade to Premium
                </Link>
            </section>
        </div>
    );
}

function SegmentedControl({ label, value, options, onChange }) {
    return (
        <div className="mt-5">
            <p className="mb-2 text-sm font-black text-slate-600">{label}</p>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
                {options.map((option) => {
                    const active = value === option;
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange(option)}
                            className={`rounded-2xl px-3 py-3 text-sm font-black transition-all focus:outline-none focus:ring-4 focus:ring-green-100 ${
                                active
                                    ? "bg-[#58CC02] text-white shadow-lg shadow-green-100"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function QuestionPreview({ question, index }) {
    return (
        <article className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-black text-slate-400">
                        Question {index + 1} - Source: {question.word}
                    </p>
                    <h3 className="mt-1 text-xl font-black text-slate-900">
                        {question.question}
                    </h3>
                </div>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-600">
                    {question.difficulty}
                </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => {
                    const correct = option === question.correctAnswer;
                    return (
                        <div
                            key={option}
                            className={`rounded-2xl border p-3 font-bold ${
                                correct
                                    ? "border-green-200 bg-green-50 text-[#58CC02]"
                                    : "border-slate-100 bg-slate-50 text-slate-600"
                            }`}
                        >
                            {option}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 rounded-3xl bg-sky-50 p-4">
                <p className="text-sm font-black text-[#1CB0F6]">Explanation</p>
                <p className="mt-1 font-semibold text-slate-600">
                    {question.explanation}
                </p>
            </div>
        </article>
    );
}

export default AiQuestionGenerator;
