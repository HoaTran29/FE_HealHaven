import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import CSS chung
import "./index.css";

// Import layout chung và các trang
import App from "./App.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.tsx";
import CourseListPage from "./pages/CourseListPage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";
import PostDetailPage from "./pages/PostDetailPage.tsx";

// Cấu hình các đường dẫn (routes)
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // <App /> là layout chung (chứa Navbar, Footer)

    // children là các trang con sẽ được "nhét" vào <App />
    children: [
      {
        index: true, // index: true nghĩa là trang chủ (path: '/')
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "course/:courseId",
        element: <CourseDetailsPage />,
      },
      {
        path: "courses",
        element: <CourseListPage />,
      },
      {
        path: "community",
        element: <CommunityPage />,
      },
      {
        path: "post/:postId",
        element: <PostDetailPage />,
      },
    ],
  },
]);

// Render ứng dụng
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
