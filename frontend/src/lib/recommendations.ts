import api from "@/lib/api";

export interface Recommendations {
    id: string;
    name: string;
    description: string;
    price: number;
    score: number;
    stock: number;
    imageUrl?: string;
}

export const getRecommendations = async (userId: string | number): Promise<Recommendations[]> => {
    const { data } = await api.get<Recommendations[]>(`/recommendations/${userId}`);
    return data;
}
