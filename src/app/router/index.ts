import { createBrowserRouter } from "react-router";
import { createElement } from "react";
import AuthLayout from "../layout/authLayout/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AppLayout from "../layout/appLayout/AppLayout";
import NotFoundPage from "../pages/error/NotFoundPage";
import { AuthWrapper, GuestWrapper } from "./wrappers";
import { generateRoutes } from "./generator/generateRoutes";
import { routes } from "./config/routes.config";




export const router = createBrowserRouter([
  {
    path: "/app",
    Component:AuthWrapper(AppLayout),
    errorElement: createElement(NotFoundPage),
    children: generateRoutes(routes)
  },
 {
  path: "/auth",
  Component: GuestWrapper(AuthLayout),
  children: [
    { index: true, Component: Login },
    { path: "login", Component: Login },
    { path: "register", Component: Register },
  ],
}

]);