import getComponentName from "@/utils/get-component"
import React from "react"

export const GuestWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const GuestWrapper: React.FC<P> = (props) => {
    return React.createElement(WrappedComponent, props)
  }

  GuestWrapper.displayName = `GuestWrapper (${getComponentName(WrappedComponent)})`
  return GuestWrapper
}
