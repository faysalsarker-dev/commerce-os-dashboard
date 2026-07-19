import getComponentName from "@/utils/get-component"
import React from "react"





export const AuthWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthWrapper: React.FC<P> = (props) => {
    return React.createElement(WrappedComponent, props)
  }

  AuthWrapper.displayName = `AuthWrapper(${getComponentName(WrappedComponent)})`
  return AuthWrapper
}



