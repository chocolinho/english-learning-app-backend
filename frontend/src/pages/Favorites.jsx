import { useEffect, useState } from "react";
import { Heart, Trash2, Volume2 } from "lucide-react";
import { getMyFavorites, removeFavoriteVocabulary } from "../services/favoriteService";

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            setFavorites(await getMyFavorites());
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load favorites.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchFavorites();
    }, []);

    const handleRemove = async (vocabularyId) => {
        await removeFavoriteVocabulary(vocabularyId);
        setFavorites((current) =>
            current.filter((favorite) => favorite.vocabulary.id !== vocabularyId)
        );
    };

    const speak = (word) => {
        if (!word || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    if (loading) {
        return <p className="font-black text-slate-500">Loading favorites...</p>;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="rounded-[2rem] bg-gradient-to-br from-pink-400 via-[#CE82FF] to-[#1CB0F6] p-6 text-white md:p-8">
                <h1 className="text-3xl font-black md:text-5xl">Favorite Words</h1>
                <p className="mt-3 font-semibold text-white/90">
                    Keep useful vocabulary close for quick review.
                </p>
            </section>

            {errorMessage && (
                <div className="rounded-3xl bg-red-50 p-4 font-bold text-red-500">
                    {errorMessage}
                </div>
            )}

            {favorites.length === 0 ? (
                <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
                    <Heart className="mx-auto mb-4 h-12 w-12 text-pink-400" />
                    <h2 className="text-2xl font-black text-slate-900">No favorites yet</h2>
                    <p className="mt-2 font-semibold text-slate-500">
                        Add favorites from flashcards or vocabulary review.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {favorites.map((favorite) => (
                        <article
                            key={favorite.id}
                            className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-black text-slate-400">
                                        {favorite.vocabulary.topicName}
                                    </p>
                                    <h2 className="mt-1 text-3xl font-black text-slate-900">
                                        {favorite.vocabulary.word}
                                    </h2>
                                    <p className="mt-2 font-semibold text-[#58CC02]">
                                        {favorite.vocabulary.meaning}
                                    </p>
                                    <p className="mt-3 text-sm font-semibold text-slate-500">
                                        {favorite.vocabulary.exampleSentence || "No example sentence."}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => speak(favorite.vocabulary.word)}
                                        className="rounded-2xl bg-blue-50 p-3 text-[#1CB0F6]"
                                        aria-label="Pronounce word"
                                    >
                                        <Volume2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(favorite.vocabulary.id)}
                                        className="rounded-2xl bg-red-50 p-3 text-red-500"
                                        aria-label="Remove favorite"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;
