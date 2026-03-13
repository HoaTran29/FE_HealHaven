import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type User } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: User['role'][];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isLoggedIn, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="page-loader">Đang kiểm tra phiên đăng nhập...</div>;
    }

    if (!isLoggedIn || !user) {
        // Chưa đăng nhập → Chuyển tới login, nhớ trang hiện tại để login xong quay lại
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
            // Đã đăng nhập nhưng không có quyền → đá về trang chủ hoặc trang báo lỗi 403
            return <Navigate to="/" replace />;
        }
    }

    // Hợp lệ, render component
    return <>{children}</>;
};

export default ProtectedRoute;
