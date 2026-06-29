import { useEffect, useState } from "react";
import { Crown, Lock } from "lucide-react";
import {
    createTopic,
    deleteTopic,
    getTopics,
    updateTopic,
} from "../services/topicService";
import { useAuth } from "../context/AuthContext";
import PremiumLockedModal from "../components/PremiumLockedModal";

function Topics() {
    const { isPremium } = useAuth();
    const [topics, setTopics] = useState([]);
    const [name, setName] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);

    const fetchTopics = async () => {
        try {
            setLoading(true);
            const data = await getTopics();
            setTopics(data);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load topics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTopics();
    }, []);

    const resetForm = () => {
        setName("");
        setEditingId(null);
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!name.trim()) {
            setErrorMessage("Topic name is required.");
            return;
        }

        try {
            if (editingId) {
                await updateTopic(editingId, {
                    name: name.trim(),
                });
            } else {
                await createTopic({
                    name: name.trim(),
                });
            }

            resetForm();
            fetchTopics();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 403) {
                setErrorMessage(
                    error.response?.data?.message ||
                        "This action requires Premium."
                );
                setPremiumModalOpen(true);
                return;
            }

            setErrorMessage("Failed to save topic.");
        }
    };

    const handleEdit = (topic) => {
        setEditingId(topic.id);
        setName(topic.name);
        setErrorMessage("");
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this topic?")) return;

        try {
            await deleteTopic(id);
            fetchTopics();

            if (editingId === id) {
                resetForm();
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to delete topic.");
        }
    };

    return (
        <div>
            <PremiumLockedModal
                open={premiumModalOpen}
                title="Custom topic limit reached"
                description="Free learners can create up to 3 custom topics. Premium removes this limit and unlocks more learning tools."
                onClose={() => setPremiumModalOpen(false)}
            />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">
                        Manage Topics
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Create and manage learning topics.
                    </p>
                </div>
            </div>

            <section className="mb-6 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                isPremium
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                        >
                            {isPremium ? (
                                <Crown className="h-6 w-6" />
                            ) : (
                                <Lock className="h-6 w-6" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-400">
                                Topic Creator
                            </p>
                            <p className="font-black text-slate-800">
                                {isPremium
                                    ? "Unlimited custom topics"
                                    : "Free plan: up to 3 custom topics"}
                            </p>
                        </div>
                    </div>

                    {!isPremium && (
                        <button
                            type="button"
                            onClick={() => setPremiumModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-100 px-5 py-3 font-black text-yellow-700 transition-all hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-100"
                        >
                            <Crown className="h-5 w-5" />
                            Upgrade
                        </button>
                    )}
                </div>
            </section>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6"
            >
                <h2 className="text-xl font-black text-slate-800 mb-4">
                    {editingId ? "Edit Topic" : "Add New Topic"}
                </h2>

                {errorMessage && (
                    <div className="mb-4 bg-red-50 text-red-500 px-4 py-3 rounded-2xl text-sm font-bold">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Topic name"
                        className="border border-slate-200 bg-slate-50 rounded-2xl p-4 flex-1 outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="bg-[#58CC02] text-white px-7 py-4 rounded-2xl font-black shadow-md hover:scale-[1.02] transition-all"
                    >
                        {editingId ? "Update Topic" : "Add Topic"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-slate-100 text-slate-600 px-7 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-black text-slate-800">
                        Topic List
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500 font-bold">
                        Loading topics...
                    </div>
                ) : topics.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-slate-500 font-bold">
                            No topics found.
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                            Create your first topic to start learning.
                        </p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left p-4 text-slate-500 text-sm">
                                ID
                            </th>
                            <th className="text-left p-4 text-slate-500 text-sm">
                                Name
                            </th>
                            <th className="text-left p-4 text-slate-500 text-sm">
                                Access
                            </th>
                            <th className="text-right p-4 text-slate-500 text-sm">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {topics.map((topic) => (
                            <tr
                                key={topic.id}
                                className="border-t border-slate-100"
                            >
                                <td className="p-4 text-slate-500">
                                    {topic.id}
                                </td>

                                <td className="p-4 font-bold text-slate-800">
                                    {topic.name}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-black ${
                                            topic.accessType === "PREMIUM"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-50 text-[#58CC02]"
                                        }`}
                                    >
                                        {topic.accessType || "FREE"}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() =>
                                                handleEdit(topic)
                                            }
                                            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-500 font-black hover:bg-blue-100 transition-all"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(topic.id)
                                            }
                                            className="px-4 py-2 rounded-xl bg-red-50 text-red-500 font-black hover:bg-red-100 transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Topics;
