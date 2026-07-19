import { useMemo, useCallback } from 'react'
// import { useGetMeQuery, authApi } from '../../api/authApi'
import { useAppDispatch } from '@/redux/hooks'

interface UseAuthResult {
  user: any | undefined
  isAuthenticated: boolean
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  hasPermission: (action: string, resource: string) => boolean
  refetchMe: () => void
  clearAuth: () => void
}

export const useAuth = (): UseAuthResult => {
  const dispatch = useAppDispatch()

//   const { data: user, isLoading, isFetching, isError, isSuccess, refetch } = useGetMeQuery(undefined, {
//     // don't refetch on every mount if cache is fresh
//     refetchOnMountOrArgChange: false,
//   })

//   const isAuthenticated = useMemo(() => isSuccess && !!user, [isSuccess, user])
  const isAuthenticated = false

  // permission check — memoized against user reference, not recalculated every render
  const hasPermission = useCallback(
    (action: string, resource: string): boolean => {
      if (!user) return false
      if (user.role === 'ADMIN') return true
      return user.permissions.some((p) => p.action === action && p.resource === resource)
    },
    [user]
  )

//   const refetchMe = useCallback(() => {
//     refetch()
//   }, [refetch])

//   const clearAuth = useCallback(() => {
//     dispatch(authApi.util.resetApiState())
//   }, [dispatch])

//   return useMemo(
//     () => ({
//       user,
//       isAuthenticated,
//       isLoading,
//       isFetching,
//       isError,
//       hasPermission,
//       refetchMe,
//       clearAuth,
//     }),
//     [user, isAuthenticated, isLoading, isFetching, isError, hasPermission, refetchMe, clearAuth]
//   )
}