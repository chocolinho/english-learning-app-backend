import { useEffect, useState } from "react";
import { getVocabularies } from "../services/vocabularyService";
import { submitQuizResult } from "../services/quizService";
import { RotateCcw, Trophy, CheckCircle2, XCircle, Star } from "lucide-react";

function QuizPractice() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const getUniqueVocabulariesByMeaning = (vocabularies) => {
        const map = new Map();

        vocabularies.forEach((item) => {
            if (!item.word || !item.meaning) return;

            const meaningKey = item.meaning.trim().toLowerCase();

            if (!map.has(meaningKey)) {
                map.set(meaningKey, item);
            }
        });

        return Array.from(map.values());
    };

    const generateOptions = (correctVocabulary, allVocabularies) => {
        const wrongVocabularies = allVocabularies.filter(
            (item) =>
                item.id !== correctVocabulary.id &&
                item.meaning?.trim().toLowerCase() !==
                correctVocabulary.meaning?.trim().toLowerCase()
        );

        const wrongOptions = shuffleArray(wrongVocabularies)
            .slice(0, 3)
            .map((item, index) => ({
                id: `wrong-${item.id}-${index}`,
                text: item.meaning,
                isCorrect: false,
            }));

        const correctOption = {
            id: `correct-${correctVocabulary.id}`,
            text: correctVocabulary.meaning,
            isCorrect: true,
        };

        return shuffleArray([correctOption, ...wrongOptions]);
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const vocabularies = await getVocabularies();

                const cleanVocabularies =
                    getUniqueVocabulariesByMeaning(vocabularies);

                if (cleanVocabularies.length < 4) {
                    setErrorMessage(
                        "You need at least 4 vocabularies with different meanings to start a quiz."
                    );
                    return;
                }

                const selectedVocabularies = shuffleArray(cleanVocabularies).slice(0, 5);

                const generatedQuestions = selectedVocabularies.map((vocabulary) => ({
                    id: vocabulary.id,
                    word: vocabulary.word,
                    correctAnswer: vocabulary.meaning,
                    options: generateOptions(vocabulary, cleanVocabularies),
                }));

                setQuestions(generatedQuestions);
            } catch (error) {
                console.error(error);
                setErrorMessage("Failed to load quiz questions.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const calculateAndSubmitResult = async (finalAnswers) => {
        const totalQuestions = questions.length;

        const correctAnswers = finalAnswers.filter(
            (answer) => answer.isCorrect
        ).length;

        const score = Math.round((correctAnswers / totalQuestions) * 100);

        const quizResult = {
            answers: finalAnswers.map((answer) => ({
                vocabularyId: answer.questionId,
                answer: answer.selectedAnswer,
            })),
        };

        try {
            setSubmitting(true);
            setErrorMessage("");

            const response = await submitQuizResult(quizResult);

            setResult({
                totalQuestions: response.totalQuestions,
                correctAnswers: response.correctAnswers,
                score: response.score,
                earnedXp: response.earnedXp,
                totalXp: response.totalXp,
            });
        } catch (error) {
            console.error("Submit quiz failed:", error);
            console.error("Backend response:", error.response?.data);
            console.error("Status:", error.response?.status);

            setResult({
                totalQuestions,
                correctAnswers,
                score,
                earnedXp: 0,
                totalXp: 0,
            });

            setErrorMessage(
                "Quiz completed, but failed to save result to backend."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleChooseAnswer = (option) => {
        if (selectedOptionId || submitting || result) return;

        const currentQuestion = questions[currentIndex];

        const answerData = {
            questionId: currentQuestion.id,
            word: currentQuestion.word,
            selectedAnswer: option.text,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: option.isCorrect,
        };

        const newAnswers = [...answers, answerData];

        setSelectedOptionId(option.id);
        setAnswers(newAnswers);

        setTimeout(() => {
            const isLastQuestion = currentIndex === questions.length - 1;

            if (isLastQuestion) {
                calculateAndSubmitResult(newAnswers);
            } else {
                setCurrentIndex((prev) => prev + 1);
                setSelectedOptionId(null);
            }
        }, 600);
    };

    const handleRestart = () => {
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="flex justify-center mb-4 animate-bounce">
                        <Trophy size={56} className="text-[#58CC02]" />
                    </div>
                    <p className="text-slate-500 font-bold">
                        Loading quiz...
                    </p>
                </div>
            </div>
        );
    }

    if (errorMessage && questions.length === 0) {
        return (
            <div className="bg-red-50 text-red-500 p-5 rounded-3xl font-bold">
                {errorMessage}
            </div>
        );
    }

    if (result) {
        return (
            <div className="max-w-3xl mx-auto">
                {errorMessage && (
                    <div className="bg-yellow-50 text-yellow-600 p-4 rounded-2xl font-bold mb-5">
                        {errorMessage}
                    </div>
                )}

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                        <Trophy size={42} className="text-[#58CC02]" />
                    </div>

                    <h1 className="text-4xl font-black text-slate-800">
                        Quiz Completed!
                    </h1>

                    <p className="text-7xl font-black text-[#58CC02] mt-6">
                        {Math.round(result.score)}%
                    </p>

                    <div className="flex justify-center items-center gap-2 mt-4">
                        <Star size={24} className="text-yellow-500" />
                        <p className="text-xl font-black text-yellow-500">
                            +{result.earnedXp || 0} XP
                        </p>
                    </div>

                    <p className="text-slate-500 font-bold mt-1">
                        Total XP: {result.totalXp || 0}
                    </p>

                    <p className="text-slate-500 font-bold mt-3">
                        Correct: {result.correctAnswers} / {result.totalQuestions}
                    </p>

                    <div className="mt-8 space-y-3 text-left">
                        {answers.map((answer, index) => (
                            <div
                                key={`${answer.questionId}-${index}`}
                                className={`p-4 rounded-2xl border ${
                                    answer.isCorrect
                                        ? "bg-green-50 border-green-100"
                                        : "bg-red-50 border-red-100"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {answer.isCorrect ? (
                                        <CheckCircle2
                                            size={20}
                                            className="text-[#58CC02]"
                                        />
                                    ) : (
                                        <XCircle
                                            size={20}
                                            className="text-red-500"
                                        />
                                    )}

                                    <p className="font-black text-slate-800">
                                        {index + 1}. {answer.word}
                                    </p>
                                </div>

                                <p className="text-sm text-slate-500 mt-2">
                                    Your answer:{" "}
                                    <span
                                        className={
                                            answer.isCorrect
                                                ? "text-[#58CC02] font-bold"
                                                : "text-red-500 font-bold"
                                        }
                                    >
                                        {answer.selectedAnswer}
                                    </span>
                                </p>

                                {!answer.isCorrect && (
                                    <p className="text-sm text-slate-500">
                                        Correct answer:{" "}
                                        <span className="text-[#58CC02] font-bold">
                                            {answer.correctAnswer}
                                        </span>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleRestart}
                        className="mt-8 bg-[#1CB0F6] text-white px-8 py-4 rounded-2xl font-black shadow-md inline-flex items-center gap-2"
                    >
                        <RotateCcw size={20} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    const progress = Math.round(
        ((currentIndex + 1) / questions.length) * 100
    );

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <p className="font-black text-slate-500">
                        Question {currentIndex + 1} of {questions.length}
                    </p>

                    <p className="font-black text-[#58CC02]">
                        {progress}%
                    </p>
                </div>

                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#58CC02] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <p className="text-sm font-black text-slate-400 mb-3">
                    Choose the correct meaning
                </p>

                <h1 className="text-5xl font-black text-slate-800 mb-8">
                    {currentQuestion.word}
                </h1>

                <div className="grid gap-4">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrect = isSelected && option.isCorrect;
                        const isWrong = isSelected && !option.isCorrect;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleChooseAnswer(option)}
                                disabled={selectedOptionId !== null || submitting}
                                className={`p-5 rounded-2xl border-2 text-left font-black transition-all ${
                                    isCorrect
                                        ? "border-[#58CC02] bg-green-50 text-[#58CC02]"
                                        : isWrong
                                            ? "border-red-400 bg-red-50 text-red-500"
                                            : "border-slate-100 bg-slate-50 text-slate-700 hover:border-[#1CB0F6] hover:bg-blue-50"
                                }`}
                            >
                                {option.text}
                            </button>
                        );
                    })}
                </div>

                {submitting && (
                    <p className="text-center text-slate-500 font-bold mt-6">
                        Saving result...
                    </p>
                )}
            </div>
        </div>
    );
}

export default QuizPractice;