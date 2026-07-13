import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { RouterProvider } from "react-router"
import { Provider as ReduxProvider } from "react-redux"
import { store } from "./redux/store"
import { ThemeProvider } from "./providers/theme/theme-provider"
import { router } from "./app/router"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>
)
