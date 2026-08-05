import { useAuth } from "@/hooks/auth/useAuth"
import { canAccessPage } from "@/lib/permissions/can"
import type { Role } from "@/types/data-types/enums"
import type { Page } from "@/types/permissions/permissions.types"
import getComponentName from "@/utils/get-component"
import React, { useEffect } from "react"
import { useLocation, useMatches, useNavigate } from "react-router"
import PageLoader from "@/components/ui/root-loading"


export const AuthWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthWrapper: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading, isFetching, isReady, role } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const matches = useMatches()




    const currentPage = matches
      .map((m) => (m.handle as { page?: Page } | undefined)?.page)
      .filter(Boolean)
      .pop()

    const hasPermission =
      !currentPage || canAccessPage(role as Role, currentPage)





    useEffect(() => {
      if (!isReady) return

      if (!isAuthenticated) {
        navigate("/auth/login", { replace: true })
        return
      }
      if (!hasPermission) {
        navigate("/unauthorized", {
          state: { from: location.pathname },
          replace: true,
        })
      }
    }, [isAuthenticated, isReady, hasPermission, location.pathname, navigate])


    if (isLoading) return <PageLoader />




    if (!isReady || isFetching) return <PageLoader />
    if (!isAuthenticated || !hasPermission) return null

    return React.createElement(WrappedComponent, props)
  }

  AuthWrapper.displayName = `AuthWrapper(${getComponentName(WrappedComponent)})`
  return AuthWrapper
}