import axiosClient from "../api/axiosClient";

export const getMyAnalytics = async () => {
    const response = await axiosClient.get("/api/analytics/me");
    return response.data;
};
