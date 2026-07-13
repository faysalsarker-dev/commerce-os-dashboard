import { createBrowserRouter } from "react-router";
import { createElement } from "react";
import AuthLayout from "../layout/authLayout/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AppLayout from "../layout/appLayout/AppLayout";
import NotFoundPage from "../pages/error/NotFoundPage";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    errorElement: createElement(NotFoundPage),
    // children: [
    
    // ],
  },
 {
  path: "/auth",
  Component: AuthLayout,
  children: [
    { index: true, Component: Login },
    { path: "login", Component: Login },
    { path: "register", Component: Register },
  ],
}

]);