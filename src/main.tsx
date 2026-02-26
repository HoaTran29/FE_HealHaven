import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChatProvider } from './contexts/ChatContext'
import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import './index.css'

// Layouts
import App from './App.tsx'
import AdminLayout from './layouts/AdminLayout.tsx'

// Attendee Pages (Lazy Load)
const HomePage = React.lazy(() => import('./pages/HomePage.tsx'));
const LoginPage = React.lazy(() => import('./pages/LoginPage.tsx'));
const SignupPage = React.lazy(() => import('./pages/SignupPage.tsx'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage.tsx'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage.tsx'));
const WorkshopListPage = React.lazy(() => import('./pages/WorkshopListPage.tsx'));
const WorkshopDetailsPage = React.lazy(() => import('./pages/WorkshopDetailsPage.tsx'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage.tsx'));
const PostDetailPage = React.lazy(() => import('./pages/PostDetailPage.tsx'));
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage.tsx'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage.tsx'));
const MyOrdersPage = React.lazy(() => import('./pages/MyOrdersPage.tsx'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage.tsx'));

// Admin Pages (Lazy Load)
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage.tsx'));
const AdminUserPage = React.lazy(() => import('./pages/admin/AdminUserPage.tsx'));
const AdminWorkshopPage = React.lazy(() => import('./pages/admin/AdminWorkshopPage.tsx'));

const wrap = (Page: React.LazyExoticComponent<React.FC>) => (
  <Suspense fallback={<div className="page-loader">Đang tải...</div>}>
    <Page />
  </Suspense>
);

const router = createBrowserRouter([
  // ============ LAYOUT CHÍNH (Attendee) ============
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: wrap(HomePage) },
      { path: 'login', element: wrap(LoginPage) },
      { path: 'signup', element: wrap(SignupPage) },
      { path: 'forgot-password', element: wrap(ForgotPasswordPage) },  // F2.1
      { path: 'reset-password/:token', element: wrap(ResetPasswordPage) },   // F2.1
      { path: 'workshops', element: wrap(WorkshopListPage) },     // F2.2
      { path: 'workshop/:id', element: wrap(WorkshopDetailsPage) },  // F2.3
      { path: 'checkout', element: wrap(CheckoutPage) },         // F2.4
      { path: 'my-schedule', element: wrap(MyOrdersPage) },          // F2.6
      { path: 'community', element: wrap(CommunityPage) },
      { path: 'post/:postId', element: wrap(PostDetailPage) },       // Community detail
      { path: 'profile', element: wrap(UserProfilePage) },
      { path: 'settings', element: wrap(SettingsPage) },   // F1.2
    ]
  },

  // ============ LAYOUT ADMIN ============
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: wrap(AdminDashboardPage) },  // F5.4
      { path: 'workshops', element: wrap(AdminWorkshopPage) },   // F5.1
      { path: 'users', element: wrap(AdminUserPage) },       // F5.2
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </AuthProvider>
    </SettingsProvider>
  </React.StrictMode>
)