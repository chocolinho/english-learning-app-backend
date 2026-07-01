import axiosClient from "../api/axiosClient";

export const generateAiQuestions = async (payload) => {
    const response = await axiosClient.post("/api/ai/questions/generate", payload);
    return response.data;
};
