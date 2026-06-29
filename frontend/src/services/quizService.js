import axiosClient from "../api/axiosClient";

export const submitQuizResult = async (quizResult) => {
    const response = await axiosClient.post("/api/quizzes/submit", quizResult);
    return response.data;
};

export const getQuizResults = async () => {
    const response = await axiosClient.get("/api/quizzes/results");
    return response.data;
};

export const getMyQuizResults = async () => {
    const response = await axiosClient.get("/api/quizzes/my-results");
    return response.data;
};

export const getQuizQuestionsByTopic = async (topicId, limit) => {
    const response = await axiosClient.get(`/api/quizzes/topic/${topicId}/questions`, {
        params: limit ? { limit } : {},
    });
    return response.data;
};
