import axiosClient from "../api/axiosClient";

export const getCurrentUser = async () => {
    const response = await axiosClient.get("/api/users/me");
    return response.data;
};

export const updateCurrentUser = async (payload) => {
    const response = await axiosClient.put("/api/users/me", payload);
    return response.data;
};

export const changePassword = async (payload) => {
    const response = await axiosClient.put("/api/users/change-password", payload);
    return response.data;
};
