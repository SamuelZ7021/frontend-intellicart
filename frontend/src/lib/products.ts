import api from "./api";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const getAdminProducts = async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('/products');
    return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const { data } = await api.post<Product>('/products', product);
    return data;
};

export const updateProduct = async (id: number, product: Omit<Product, 'id'>): Promise<Product> => {
    const { data } = await api.put<Product>(`/products/${id}`, product);
    return data;
};

export const getProductById = async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
};