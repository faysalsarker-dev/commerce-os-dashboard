import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { RouterProvider } from "react-router"
import { Provider as ReduxProvider } from "react-redux"
import { store } from "./redux/store"
import { ThemeProvider } from "./providers/theme/theme-provider"
import { SocketProvider } from "./providers/SocketProvider"
import { router } from "./app/router"
import { Toaster } from "sonner"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider>
        <SocketProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors  />
        </SocketProvider>
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>
)

