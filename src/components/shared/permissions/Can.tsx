import { usePermission } from "@/lib/permissions/usePermission"
import type { Action, Resource } from "@/types/permissions/permissions.types"
import type { ReactNode } from "react"


interface CanProps {
  I: Action
  a: Resource
  fallback?: ReactNode
  children: ReactNode
}

export function Can({ I, a, fallback = null, children }: CanProps) {
  const { can } = usePermission()
  return can(I, a) ? <>{children}</> : <>{fallback}</>
}