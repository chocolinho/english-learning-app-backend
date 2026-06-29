import axiosClient from "../api/axiosClient";

export const checkoutPremium = async (planType) => {
    const response = await axiosClient.post("/api/subscriptions/checkout", {
        planType,
    });
    return response.data;
};

export const getPaymentHistory = async () => {
    const response = await axiosClient.get("/api/payments/my-history");
    return response.data;
};
