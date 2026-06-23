import { useEffect, useState } from "react";
import { createTopic, deleteTopic, getTopics } from "../services/topicService";

function Topics() {
    const [topics, setTopics] = useState([]);
    const [name, setName] = useState("");

    const fetchTopics = async () => {
        const data = await getTopics();
        setTopics(data);
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!name.trim()) return;

        await createTopic({ name });
        setName("");
        fetchTopics();
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this topic?")) return;

        await deleteTopic(id);
        fetchTopics();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Topics</h1>

            <form
                onSubmit={handleCreate}
                className="bg-white p-6 rounded-xl shadow mb-6 flex gap-4"
            >
                <input
                    type="text"
                    placeholder="Topic name"
                    className="border rounded-lg p-3 flex-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button className="bg-blue-600 text-white px-6 rounded-lg">
                    Add Topic
                </button>
            </form>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-100">
                    <tr>
                        <th className="text-left p-4">ID</th>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {topics.map((topic) => (
                        <tr key={topic.id} className="border-t">
                            <td className="p-4">{topic.id}</td>
                            <td className="p-4">{topic.name}</td>
                            <td className="p-4">
                                <button
                                    onClick={() => handleDelete(topic.id)}
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

export default Topics;