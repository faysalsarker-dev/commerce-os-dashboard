import { Outlet, ScrollRestoration } from "react-router"

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sidebar">
      <ScrollRestoration />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
