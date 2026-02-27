/**
 * API Service Layer — HealHaven FE
 * Tất cả request tới BE đi qua file này.
 * Khi BE thay đổi base URL, chỉ cần sửa BASE_URL ở đây.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// --- HELPER: lấy token từ localStorage ---
const getToken = (): string | null => localStorage.getItem('healhaven_token');

// --- HELPER: request chung ---
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        // Trích xuất message lỗi từ BE (nếu có)
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.message || `HTTP ${res.status}`);
    }

    // Trả về null nếu BE không trả về body (204 No Content)
    if (res.status === 204) return null as T;

    return res.json() as Promise<T>;
}

// ============================================================
// AUTH
// ============================================================

export interface LoginPayload { email: string; password: string }
export interface SignupPayload { fullName: string; email: string; password: string; role: 'attendee' | 'host' }

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: 'attendee' | 'host' | 'venue' | 'admin';
        avatar?: string;
    };
}

export const authApi = {
    login: (data: LoginPayload) => request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    signup: (data: SignupPayload) => request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    forgotPassword: (email: string) => request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token: string, newPassword: string) =>
        request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
    getMe: () => request<AuthResponse['user']>('/auth/me'),
};

// ============================================================
// WORKSHOPS
// ============================================================

export interface Workshop {
    id: string;
    title: string;
    subtitle: string;
    host: string;
    hostId: string;
    category: string;
    area: string;       // Quận/Huyện
    city: string;
    address: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    availableSeats: number;
    maxSeats: number;
    date: string;       // ISO date string
    time: string;       // "09:00 - 11:00"
    image: string;
    images?: string[];  // Gallery ảnh
    lat?: number;
    lng?: number;
    curriculum?: { name: string; time: string; active: boolean }[];
    materials?: string[];
}

export interface WorkshopFilters {
    keyword?: string;
    category?: string;
    area?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    date?: string;
    page?: number;
    limit?: number;
}

export interface WorkshopListResponse {
    data: Workshop[];
    total: number;
    page: number;
    totalPages: number;
}

export const workshopApi = {
    getList: (filters: WorkshopFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => v !== undefined && v !== '' && params.set(k, String(v)));
        return request<WorkshopListResponse>(`/workshops?${params.toString()}`);
    },
    getById: (id: string) => request<Workshop>(`/workshops/${id}`),
    getFeatured: () => request<Workshop[]>('/workshops/featured'),
};

// ============================================================
// ORDERS (Đặt chỗ)
// ============================================================

export type OrderStatus = 'pending' | 'confirmed' | 'attended' | 'cancelled';

export interface Order {
    id: string;
    workshopId: string;
    workshopTitle: string;
    workshopImage: string;
    host: string;
    date: string;
    time: string;
    location: string;
    seats: number;
    totalPrice: number;
    status: OrderStatus;
    ticketCode?: string;
}

export interface CreateOrderPayload {
    workshopId: string;
    seats: number;
    paymentMethod: 'vnpay' | 'momo' | 'transfer';
    transferProofUrl?: string; // URL sau khi upload ảnh
}

export const orderApi = {
    create: (data: CreateOrderPayload) => request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    getMyOrders: () => request<Order[]>('/orders/me'),
    cancel: (orderId: string, reason: string) => request<Order>(`/orders/${orderId}/cancel`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
};

// ============================================================
// REVIEWS
// ============================================================

export interface ReviewPayload {
    workshopId: string;
    rating: number;       // 1–5
    comment: string;
    images?: string[];    // URL ảnh đã upload
}

export const reviewApi = {
    create: (data: ReviewPayload) => request<{ id: string }>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
    getByWorkshop: (workshopId: string) => request<{ data: ReviewPayload[] }>(`/reviews/workshop/${workshopId}`),
};
