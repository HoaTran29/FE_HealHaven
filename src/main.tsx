import React, { Suspense } from 'react' // <-- 1. Import Suspense
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChatProvider } from './contexts/ChatContext' 
import './index.css' 

// --- Import Layouts (Tải ngay) ---
import App from './App.tsx'
import AdminLayout from './layouts/AdminLayout.tsx'

// --- Import Trang (User-facing) ---
// 2. Dùng React.lazy để "tải lười" TẤT CẢ các trang
const HomePage = React.lazy(() => import('./pages/HomePage.tsx'));
const LoginPage = React.lazy(() => import('./pages/LoginPage.tsx'));
const SignupPage = React.lazy(() => import('./pages/SignupPage.tsx'));
const CourseDetailsPage = React.lazy(() => import('./pages/CourseDetailsPage.tsx'));
const CourseListPage = React.lazy(() => import('./pages/CourseListPage.tsx'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage.tsx'));
const PostDetailPage = React.lazy(() => import('./pages/PostDetailPage.tsx'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage.tsx'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage.tsx'));
const AiHelperPage = React.lazy(() => import('./pages/AiHelperPage.tsx'));
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage.tsx'));

// --- Import Trang (Admin) ---
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage.tsx'));
const AdminWorkshopPage = React.lazy(() => import('./pages/admin/AdminWorkshopPage.tsx'));
const AdminUserPage = React.lazy(() => import('./pages/admin/AdminUserPage.tsx'));

// 3. Tạo một component "Loading..."
// Component này sẽ hiển thị khi người dùng chuyển trang và chờ code tải về
const PageLoader: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--primary)' }}>
    Đang tải trang...
  </div>
);


const router = createBrowserRouter([
  // === NHÓM 1: ROUTE CHO NGƯỜI DÙNG ===
  {
    path: '/',
    element: <App />, 
    children: [
      // 4. Bọc tất cả element bằng <Suspense>
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: 'login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: 'signup', element: <Suspense fallback={<PageLoader />}><SignupPage /></Suspense> },
      { path: 'course/:courseId', element: <Suspense fallback={<PageLoader />}><CourseDetailsPage /></Suspense> },
      { path: 'courses', element: <Suspense fallback={<PageLoader />}><CourseListPage /></Suspense> },
      { path: 'community', element: <Suspense fallback={<PageLoader />}><CommunityPage /></Suspense> },
      { path: 'post/:postId', element: <Suspense fallback={<PageLoader />}><PostDetailPage /></Suspense> },
      { path: 'forgot-password', element: <Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense> },
      { path: 'reset-password/:token', element: <Suspense fallback={<PageLoader />}><ResetPasswordPage /></Suspense> },
      { path: 'ai-helper', element: <Suspense fallback={<PageLoader />}><AiHelperPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<PageLoader />}><UserProfilePage /></Suspense> }
    ]
  },
  
  // === NHÓM 2: ROUTE CHO ADMIN ===
  {
    path: '/admin', 
    element: <AdminLayout />, 
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense> },
      { path: 'workshops', element: <Suspense fallback={<PageLoader />}><AdminWorkshopPage /></Suspense> },
      { path: 'users', element: <Suspense fallback={<PageLoader />}><AdminUserPage /></Suspense> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  </React.StrictMode>,
)