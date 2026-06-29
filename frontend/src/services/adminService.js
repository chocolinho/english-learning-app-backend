import axiosClient from "../api/axiosClient";

export const getAdminStats = async () => {
    const response = await axiosClient.get("/api/admin/stats");
    return response.data;
};
