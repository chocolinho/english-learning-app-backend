import { useEffect, useState } from "react";
import { getTopics } from "../services/topicService";
import {
    createVocabulary,
    deleteVocabulary,
    getVocabularies,
} from "../services/vocabularyService";

function Vocabularies() {
    const [vocabularies, setVocabularies] = useState([]);
    const [topics, setTopics] = useState([]);

    const [form, setForm] = useState({
        word: "",
        meaning: "",
        exampleSentence: "",
        topicId: "",
    });

    const fetchData = async () => {
        const [vocabularyData, topicData] = await Promise.all([
            getVocabularies(),
            getTopics(),
        ]);

        setVocabularies(vocabularyData);
        setTopics(topicData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!form.word || !form.meaning || !form.topicId) return;

        await createVocabulary({
            ...form,
            topicId: Number(form.topicId),
        });

        setForm({
            word: "",
            meaning: "",
            exampleSentence: "",
            topicId: "",
        });

        fetchData();
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this vocabulary?")) return;

        await deleteVocabulary(id);
        fetchData();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Vocabularies</h1>

            <form
                onSubmit={handleCreate}
                className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-2 gap-4"
            >
                <input
                    name="word"
                    placeholder="Word"
                    className="border rounded-lg p-3"
                    value={form.word}
                    onChange={handleChange}
                />

                <input
                    name="meaning"
                    placeholder="Meaning"
                    className="border rounded-lg p-3"
                    value={form.meaning}
                    onChange={handleChange}
                />

                <input
                    name="exampleSentence"
                    placeholder="Example sentence"
                    className="border rounded-lg p-3"
                    value={form.exampleSentence}
                    onChange={handleChange}
                />

                <select
                    name="topicId"
                    className="border rounded-lg p-3"
                    value={form.topicId}
                    onChange={handleChange}
                >
                    <option value="">Select topic</option>
                    {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                            {topic.name}
                        </option>
                    ))}
                </select>

                <button className="bg-blue-600 text-white p-3 rounded-lg col-span-2">
                    Add Vocabulary
                </button>
            </form>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-100">
                    <tr>
                        <th className="text-left p-4">Word</th>
                        <th className="text-left p-4">Meaning</th>
                        <th className="text-left p-4">Example</th>
                        <th className="text-left p-4">Topic</th>
                        <th className="text-left p-4">Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {vocabularies.map((vocabulary) => (
                        <tr key={vocabulary.id} className="border-t">
                            <td className="p-4 font-medium">
                                {vocabulary.word}
                            </td>
                            <td className="p-4">
                                {vocabulary.meaning}
                            </td>
                            <td className="p-4">
                                {vocabulary.exampleSentence}
                            </td>
                            <td className="p-4">
                                {vocabulary.topicName}
                            </td>
                            <td className="p-4">
                                <button
                                    onClick={() =>
                                        handleDelete(vocabulary.id)
                                    }
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Vocabularies;