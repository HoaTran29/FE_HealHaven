/**
 * API Service Layer — HealHaven FE
 * Base URL: http://localhost:8080/api (VITE_API_URL trong .env.local)
 * Tất cả response BE bọc trong: { success, message, data }
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ============================================================
// BE ApiResponse wrapper
// ============================================================
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

// ============================================================
// Core request helper — tự unwrap ApiResponse.data
// ============================================================
export const getToken = (): string | null => localStorage.getItem('healhaven_token');

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();

    console.log(`📡 API Request: ${options.method || 'GET'} ${endpoint}`, {
        hasToken: !!token
    });
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
        ...options,
    });

    if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error(`❌ API Error: ${res.status} ${endpoint}`, errBody);
        throw new Error(errBody?.message || `HTTP ${res.status}`);
    }

    if (res.status === 204) return null as T;

    const json: ApiResponse<T> = await res.json();
    console.log(`✅ API Response: ${endpoint}`, json);
    if (!json.success) throw new Error(json.message || 'Request failed');
    return json.data;
}

// ============================================================
// 1. AUTH — POST /auth/**  (Public)
// ============================================================
export interface LoginPayload { email: string; password: string }
export interface SignupPayload { fullName: string; email: string; password: string; role: 'attendee' | 'host' }

export interface BeUser {
    userId: number;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
}

export interface AuthData {
    accessToken: string;
    refreshToken?: string;
    user: BeUser;
}

export const authApi = {
    login: (data: LoginPayload) => request<AuthData>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    signup: (data: SignupPayload) => request<AuthData>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    refresh: (refreshToken: string) => request<AuthData>('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
    google: (idToken: string) => request<AuthData>('/auth/google', { method: 'POST', body: JSON.stringify({ idToken }) }),
    forgotPassword: (email: string) =>
        request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token: string, newPassword: string) =>
        request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
};

// ============================================================
// 2. WORKSHOPS — GET (Public), POST/PUT/DELETE (HOST)
// ============================================================
export interface WorkshopHost {
    userId: number;
    fullName: string;
    avatarUrl?: string;
    bio?: string;
}

export interface Workshop {
    id?: string | number;
    workshopId?: number;
    title: string;
    subtitle?: string;
    host: WorkshopHost;  // BE trả object, không phải string
    hostId: string;
    category: string;
    area?: string;
    city?: string;
    location?: string;   // Fallback
    address?: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    capacity: number;           // ⚠️ Total seats as per documentation
    availableSeats: number;     // Seats left
    startDate: string;          // ⚠️ Format: dd/MM/yyyy HH:mm
    endDate?: string;           // ⚠️ Format: dd/MM/yyyy HH:mm
    itinerary?: string;         // 📝 Replaces curriculum
    materials?: string | string[]; // 🎨 Support both legacy array and new string format
    venue?: {
        name: string;
        address: string;
    };
    maxSeats?: number;          // Legacy fallback
    totalSeats?: number;        // Legacy fallback
    seats?: number;             // Legacy fallback
    date?: string;              // Legacy fallback
    time?: string;
    startTime?: string;
    image: string;
    images?: string[];
    lat?: number;
    lng?: number;
    status?: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
    curriculum?: { name: string; time: string; active: boolean }[]; // Legacy fallback
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
    size?: number;
}

/** BE dùng Spring Page: content + totalElements + totalPages + number + size */
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export const workshopApi = {
    // Public
    getList: (filters: WorkshopFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => v !== undefined && v !== '' && params.set(k, String(v)));
        return request<PageResponse<Workshop>>(`/workshops?${params.toString()}`);
    },
    getFeatured: () => request<Workshop[]>('/workshops/featured'),
    getById: (id: string) => request<Workshop>(`/workshops/${id}`),

    // HOST only (requires Bearer token)
    getMyWorkshops: () => request<PageResponse<Workshop>>('/workshops/my-workshops'),
    create: (data: Partial<Workshop>) => request<Workshop>('/workshops', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Workshop>) => request<Workshop>(`/workshops/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/workshops/${id}`, { method: 'DELETE' }),
    submit: (id: string) => request<Workshop>(`/workshops/${id}/submit`, { method: 'POST' }),
};

// ============================================================
// 3. BOOKINGS — /bookings (Protected)
// ============================================================
export type BookingStatus = 'PENDING' | 'PENDING_CONFIRMATION' | 'PAID' | 'CONFIRMED' | 'ATTENDED' | 'CANCELLED' | 'FAILED';

export interface Booking {
    id: string; // fallback
    bookingId?: number; // ⚠️ Backend primary ID
    workshopId: string | number;
    workshopTitle: string;
    workshopImage?: string;
    host?: string;
    date: string;
    time?: string;
    location?: string;
    seats: number;
    quantity?: number; // Backend quantity
    totalPrice: number;
    amount?: number; // Alias from BE
    status: BookingStatus;
    bookingStatus?: BookingStatus; // Alternative field from BE
    paymentStatus?: BookingStatus; // Add paymentStatus
    ticketCode?: string;
    workshop?: any; // Nested workshop details from BE
    user?: any; // Nested user details for Admin endpoints
    userName?: string; 
    fullName?: string;
}

export interface CreateBookingPayload {
    workshopId: string;
    quantity: number;           // ⚠️ Renamed from seats as per documentation
    paymentMethod?: 'vnpay' | 'momo' | 'transfer';
}

export const bookingApi = {
    create: (data: CreateBookingPayload) => request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    getMyList: (page: number = 0, size: number = 20) => request<any>(`/bookings/my?page=${page}&size=${size}`),
    getById: (id: string) => request<Booking>(`/bookings/${id}`),
    getCalendar: () => request<Booking[]>('/bookings/calendar'),
    // HOST only
    getByWorkshop: (workshopId: string) => request<Booking[]>(`/bookings/workshop/${workshopId}`),
    checkIn: (code: string) => request<Booking>('/bookings/check-in', { method: 'POST', body: JSON.stringify({ code }) }),
};

// Alias (tương thích code cũ dùng orderApi)
export const orderApi = bookingApi;

// ============================================================
// 4. VENUES — GET (Public), POST/PUT/DELETE (PROVIDER)
// ============================================================
export interface Venue {
    id?: string | number; // FE có lúc dùng id, BE dùng venueId
    venueId?: number;
    providerId?: number;
    providerName?: string;
    name: string;
    address: string;
    district?: string;
    area?: string; // fallback
    capacity: number;
    pricePerHour: number;
    amenities?: string | string[]; // BE trả string, FE cũ mong mảng
    description?: string;
    status?: string;
    imageUrls?: string[];
    images?: string[]; // fallback
    ownerName?: string;
}

export const venueApi = {
    getList: () => request<Venue[] | any>('/venues'),
    getById: (id: string) => request<Venue>(`/venues/${id}`),
    // PROVIDER only
    getMyVenues: () => request<Venue[]>('/venues/my-venues'),
    create: (data: Partial<Venue>) => request<Venue>('/venues', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Venue>) => request<Venue>(`/venues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/venues/${id}`, { method: 'DELETE' }),
};

// ============================================================
// 5. VENUE BOOKINGS — /venue-bookings (HOST + PROVIDER)
// ============================================================
export type VenueBookingStatus = 'REQUESTING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';

export interface VenueBooking {
    id?: string | number;
    bookingId?: number;
    venueId: string | number;
    venueName?: string;
    bookingDate?: string;
    startTime: string;
    endTime: string;
    totalPrice?: number;
    status: VenueBookingStatus;
    note?: string;
}

export const venueBookingApi = {
    // HOST
    create: (data: Partial<VenueBooking>) => request<VenueBooking>('/venue-bookings', { method: 'POST', body: JSON.stringify(data) }),
    getMyBookings: () => request<VenueBooking[]>('/venue-bookings/my-bookings'),
    // PROVIDER
    getAllForProvider: () => request<VenueBooking[]>('/venue-bookings/provider/all'),
    getPendingForProvider: () => request<VenueBooking[]>('/venue-bookings/provider/pending'),
    getByStatus: (status: VenueBookingStatus) => request<VenueBooking[]>(`/venue-bookings/provider/by-status?status=${status}`),
    approve: (id: string | number) => request<VenueBooking>(`/venue-bookings/${id}/status?status=APPROVED`, { method: 'PUT' }),
    reject: (id: string | number, reason?: string) => request<VenueBooking>(`/venue-bookings/${id}/status?status=REJECTED${reason ? `&reason=${encodeURIComponent(reason)}` : ''}`, { method: 'PUT' }),
    // Public (Venue schedule)
    getByVenue: (venueId: string) => request<VenueBooking[]>(`/venue-bookings/venue/${venueId}`),
    getSchedule: (venueId: string, from: string, to: string) =>
        request<VenueBooking[]>(`/venue-bookings/venue/${venueId}/schedule?from=${from}&to=${to}`),
};

// ============================================================
// 6. REVIEWS — POST (Protected), GET (Public)
// ============================================================
export interface Review {
    id?: string;
    workshopId: string;
    rating: number;
    comment: string;
    images?: string[];
    authorName?: string;
    authorAvatar?: string;
    createdAt?: string;
}

export const reviewApi = {
    create: (data: Omit<Review, 'id'>) => request<Review>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
    getByWorkshop: (workshopId: string) => request<PageResponse<Review>>(`/reviews/workshop/${workshopId}`),
};

// ============================================================
// 7. FINANCIALS — (HOST only)
// ============================================================
export interface FinancialStats {
    totalRevenue: number;
    totalCost: number;
    profit: number;
    monthlyData?: { month: string; revenue: number; cost: number }[];
}

export const financialApi = {
    getStats: () => request<FinancialStats>('/financials/stats'),
};

// ============================================================
// 8. REFUNDS — (Protected)
// ============================================================
export interface Refund {
    id: string;
    bookingId: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    amount?: number;
    createdAt?: string;
}

export const refundApi = {
    create: (data: { bookingId: string; reason: string }) => request<Refund>('/refunds', { method: 'POST', body: JSON.stringify(data) }),
    getMyList: () => request<Refund[]>('/refunds'),
};

// ============================================================
// 9. NOTIFICATIONS — (Protected)
// ============================================================
export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type?: string;
    link?: string;
}

export const notificationApi = {
    getAll: () => request<Notification[]>('/notifications'),
    getUnread: () => request<Notification[]>('/notifications/unread'),
    getUnreadCount: () => request<{ count: number }>('/notifications/unread-count'),
    markRead: (id: string) => request<void>(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request<void>('/notifications/read-all', { method: 'PUT' }),
};

// ============================================================
// 10. MEDIA — Upload/Delete (Protected, multipart/form-data)
// ============================================================
export interface MediaUploadResponse {
    mediaId: string;
    url: string;
    filename?: string;
}

export const mediaApi = {
    upload: (file: File): Promise<MediaUploadResponse> => {
        const token = getToken();
        const formData = new FormData();
        formData.append('file', file);
        return fetch(`${BASE_URL}/media/upload`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        })
            .then(res => res.json())
            .then((json: ApiResponse<MediaUploadResponse>) => {
                if (!json.success) throw new Error(json.message || 'Upload failed');
                return json.data;
            });
    },
    delete: (mediaId: string) => request<void>(`/media/${mediaId}`, { method: 'DELETE' }),
};

// ============================================================
// 11. PAYMENTS — VNPay (Protected + Public)
// ============================================================

/**
 * VNPay response khi verify payment return:
 * Success: { success: true, message: "Thanh toán thành công!", data: BookingResponse }
 * Failure: { success: false, message: "Thanh toán thất bại. Mã lỗi: 24" }
 */
export interface VnpayReturnResult {
    success: boolean;
    message: string;
    data?: Booking; // BookingResponse từ BE
}

export const paymentApi = {
    // Legacy mock
    mockSuccess: (bookingId: string) => request<Booking>(`/payments/mock/${bookingId}`, { method: 'POST' }),

    /**
     * Xác nhận thanh toán thủ công (User báo "Tôi đã chuyển khoản")
     * POST /payments/confirm/{bookingId}
     */
    confirmPayment: (bookingId: string): Promise<any> =>
        request<any>(`/payments/confirm/${bookingId}`, { method: 'POST' }),

    /**
     * Xác thực kết quả thanh toán sau khi VNPay redirect về.
     * GET /payments/vnpay-return?vnp_Amount=...&vnp_ResponseCode=00&... — KHÔNG cần JWT
     * queryString: window.location.search (đầy đủ query string từ URL hiện tại)
     */
    verifyVnpayReturn: async (queryString: string): Promise<VnpayReturnResult> => {
        const token = getToken();
        const res = await fetch(`${BASE_URL}/payments/vnpay-return${queryString}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json: VnpayReturnResult = await res.json();
        return json;
    },
};

// ============================================================
// 12. ADMIN — /admin (Protected, Role: ADMIN)
// ============================================================

export interface AdminUser {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
    role: string;
    isBanned: boolean;
    createdAt?: string;
}

export interface AdminStatsOverview {
    totalUsers: number;
    totalWorkshops: number;
    totalVenues: number;
    netRevenue: number;
}

export interface AdminRevenueData {
    label: string;
    value: number;
}

export interface AdminWithdrawal {
    withdrawalId: number;
    userId: number;
    fullName: string;
    amount: number;
    bankInfo: string;
    status: 'PENDING' | 'COMPLETED' | 'REJECTED';
    note?: string;
    requestedAt?: string;
    processedAt?: string;
}

export const adminApi = {
    // 1. Users
    getUsers: (role?: string, page: number = 0, size: number = 10) => {
        let url = `/admin/users?page=${page}&size=${size}`;
        if (role) url += `&role=${role}`;
        return request<PageResponse<AdminUser>>(url);
    },
    updateUserStatus: (userId: number, status: 'ACTIVE' | 'INACTIVE') =>
        request<void>(`/admin/users/${userId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    updateUserRole: (userId: number, role: 'ATTENDEE' | 'HOST' | 'PROVIDER' | 'ADMIN') =>
        request<void>(`/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),

    // 2. Workshops
    getWorkshops: (status: string = 'PENDING_APPROVAL', page: number = 0, size: number = 10) =>
        request<PageResponse<Workshop>>(`/admin/workshops?status=${status}&page=${page}&size=${size}`),
    approveWorkshop: (workshopId: string | number) =>
        request<void>(`/admin/workshops/${workshopId}/approve`, { method: 'PUT' }),
    rejectWorkshop: (workshopId: string | number, reason: string) =>
        request<void>(`/admin/workshops/${workshopId}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),

    // 3. Venues
    getVenues: (status: string = 'PENDING', page: number = 0, size: number = 10) =>
        request<PageResponse<Venue>>(`/admin/venues?status=${status}&page=${page}&size=${size}`),
    approveVenue: (venueId: string | number) =>
        request<void>(`/admin/venues/${venueId}/approve`, { method: 'PUT' }),
    rejectVenue: (venueId: string | number, reason: string) =>
        request<void>(`/admin/venues/${venueId}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),

    // 4. Analytics
    getStatsOverview: () => request<AdminStatsOverview>('/admin/stats/overview'),
    getRevenueChart: (type: 'monthly' | 'weekly' | 'daily', year: number) =>
        request<AdminRevenueData[]>(`/admin/stats/revenue-chart?type=${type}&year=${year}`),

    // 5. Withdrawals
    getWithdrawals: (status: string = 'PENDING', page: number = 0, size: number = 10) =>
        request<PageResponse<AdminWithdrawal>>(`/admin/withdrawals?status=${status}&page=${page}&size=${size}`),
    completeWithdrawal: (withdrawalId: number) =>
        request<void>(`/admin/withdrawals/${withdrawalId}/complete`, { method: 'PUT' }),
    rejectWithdrawal: (withdrawalId: number, reason: string) =>
        request<void>(`/admin/withdrawals/${withdrawalId}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),

    // 6. Payments
    getPendingPayments: (page: number = 0, size: number = 10) =>
        request<PageResponse<Booking>>(`/admin/payments/pending?page=${page}&size=${size}`),
    approvePayment: (bookingId: string | number) =>
        request<void>(`/admin/payments/${bookingId}/approve`, { method: 'PUT' }),
    rejectPayment: (bookingId: string | number, note: string) =>
        request<void>(`/admin/payments/${bookingId}/reject`, { method: 'PUT', body: JSON.stringify({ note }) }),
};
