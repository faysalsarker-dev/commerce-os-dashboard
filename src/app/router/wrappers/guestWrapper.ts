import { useAuth } from "@/hooks/auth/useAuth"
import getComponentName from "@/utils/get-component"
import React from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export const GuestWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const GuestWrapper: React.FC<P> = (props) => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()


    if (isAuthenticated) {
      toast.error("You are already logged in")
      navigate(-1)
    }

    return React.createElement(WrappedComponent, props)
  }

  GuestWrapper.displayName = `GuestWrapper (${getComponentName(WrappedComponent)})`
  return GuestWrapper
}
