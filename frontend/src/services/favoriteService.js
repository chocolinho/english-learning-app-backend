import axiosClient from "../api/axiosClient";

export const getMyFavorites = async () => {
    const response = await axiosClient.get("/api/favorites");
    return response.data;
};

export const addFavoriteVocabulary = async (vocabularyId) => {
    const response = await axiosClient.post(`/api/favorites/vocabularies/${vocabularyId}`);
    return response.data;
};

export const removeFavoriteVocabulary = async (vocabularyId) => {
    await axiosClient.delete(`/api/favorites/vocabularies/${vocabularyId}`);
};
