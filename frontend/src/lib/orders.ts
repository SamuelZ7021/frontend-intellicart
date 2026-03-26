import api from "@/lib/api";

export interface OrderItemRequest {
    productId: number;
    quantity: number;
}

export interface OrderRequest {
    items: OrderItemRequest[];
    shippingAddress: string;
}

export interface OrderResponse {
    id: number, 
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    totalPrice: number;
}

export const createOrder = async (orderData: OrderRequest): Promise<OrderResponse> => {
    const { data } = await api.post<OrderResponse>('/orders', orderData);
    return data;
}