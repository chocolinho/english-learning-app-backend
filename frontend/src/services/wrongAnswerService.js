import axiosClient from "../api/axiosClient";

export const getMyWrongAnswers = async () => {
    const response = await axiosClient.get("/api/wrong-answers");
    return response.data;
};

export const resolveWrongAnswer = async (id) => {
    await axiosClient.put(`/api/wrong-answers/${id}/resolve`);
};

export const getWrongAnswerPracticeItems = async () => {
    const response = await axiosClient.get("/api/wrong-answers/practice");
    return response.data;
};

export const submitWrongAnswerPractice = async (payload) => {
    const response = await axiosClient.post("/api/wrong-answers/practice/submit", payload);
    return response.data;
};
