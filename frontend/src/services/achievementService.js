import axiosClient from "../api/axiosClient";

export const getMyAchievements = async () => {
    const response = await axiosClient.get("/api/achievements/my");
    return response.data;
};
