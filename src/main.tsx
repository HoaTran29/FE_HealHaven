import React, { Suspense } from 'react' 
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChatProvider } from './contexts/ChatContext' 
import './index.css' 

// Layouts
import App from './App.tsx'

// Attendee Pages (Lazy Load)
const HomePage = React.lazy(() => import('./pages/HomePage.tsx'));
const LoginPage = React.lazy(() => import('./pages/LoginPage.tsx'));
const SignupPage = React.lazy(() => import('./pages/SignupPage.tsx'));
const WorkshopListPage = React.lazy(() => import('./pages/WorkshopListPage.tsx'));
const WorkshopDetailsPage = React.lazy(() => import('./pages/WorkshopDetailsPage.tsx'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage.tsx'));
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage.tsx'));
// Chức năng mới cho Attendee
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage.tsx')); 
const MyOrdersPage = React.lazy(() => import('./pages/MyOrdersPage.tsx'));

const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">Đang tải trải nghiệm chữa lành...</div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: 'login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: 'signup', element: <Suspense fallback={<PageLoader />}><SignupPage /></Suspense> },
      { path: 'workshops', element: <Suspense fallback={<PageLoader />}><WorkshopListPage /></Suspense> }, // F2.2
      { path: 'workshop/:id', element: <Suspense fallback={<PageLoader />}><WorkshopDetailsPage /></Suspense> }, // F2.3
      { path: 'checkout', element: <Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense> }, // F2.4
      { path: 'my-schedule', element: <Suspense fallback={<PageLoader />}><MyOrdersPage /></Suspense> }, // F2.6
      { path: 'community', element: <Suspense fallback={<PageLoader />}><CommunityPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<PageLoader />}><UserProfilePage /></Suspense> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  </React.StrictMode>
)