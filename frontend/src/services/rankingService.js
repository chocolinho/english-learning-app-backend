import axiosClient from "../api/axiosClient";

export const getUserRanking = async (limit = 20) => {
    const response = await axiosClient.get(`/api/rankings/users?limit=${limit}`);
    return response.data;
};
