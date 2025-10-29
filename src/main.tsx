import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import CSS chung
import "./index.css";

// Import layout chung và các trang
import App from "./App.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.tsx";
import CourseListPage from "./pages/CourseListPage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";
import PostDetailPage from "./pages/PostDetailPage.tsx";
import { ChatProvider } from "./contexts/ChatContext.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.tsx";
import AdminWorkshopPage from "./pages/admin/AdminWorkshopPage.tsx";
import AdminUserPage from "./pages/admin/AdminUserPage.tsx";
// Cấu hình các đường dẫn (routes)
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // <App /> là layout chung (chứa Navbar, Footer)

    // children là các trang con sẽ được "nhét" vào <App />
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'course/:courseId', element: <CourseDetailsPage /> },
      { path: 'courses', element: <CourseListPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'post/:postId', element: <PostDetailPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage/>},
      { path: 'reset-password/:token', element: <ResetPasswordPage/>},
      { path: 'profile', element: <UserProfilePage />}
    ],
  },
  {
    path: '/admin', // Tất cả các route bắt đầu bằng /admin
    element: <AdminLayout />, // Sẽ dùng layout Admin
    children: [
      { index: true, element: <AdminDashboardPage />},
      { path: 'workshops', element: <AdminWorkshopPage />},
      { path: 'users', element: <AdminUserPage />}
    ]
  }

]);

// Render ứng dụng
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  </React.StrictMode>
);
