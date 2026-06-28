import axiosClient from "../api/axiosClient";

export const getMyWrongAnswers = async () => {
    const response = await axiosClient.get("/api/wrong-answers");
    return response.data;
};

export const resolveWrongAnswer = async (id) => {
    await axiosClient.put(`/api/wrong-answers/${id}/resolve`);
};
