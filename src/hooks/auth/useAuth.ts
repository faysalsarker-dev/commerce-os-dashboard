import { useMemo, useCallback } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import type { User } from '@/types/data-types/user/user.type'
import { authApi, useGetMeQuery } from '@/redux/features/auth/auth.api'

interface UseAuthResult {
  user: User | undefined
  isAuthenticated: boolean
  role: string | undefined
  isLoading: boolean
  isFetching: boolean
  isPending: boolean
  isReady: boolean
  isError: boolean
  refetchMe: () => void
  clearAuth: () => void
}

export const useAuth = (): UseAuthResult => {
  const dispatch = useAppDispatch()

  const { data: userResponse, isLoading, isFetching, isError, isSuccess, refetch } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
  })

  const user = userResponse?.data
  const isPending = isLoading || isFetching
  const isAuthenticated = useMemo(() => isSuccess && !!user, [isSuccess, user])

  const refetchMe = useCallback(() => {
    refetch()
  }, [refetch])

  const clearAuth = useCallback(() => {
    dispatch(authApi.util.resetApiState())
  }, [dispatch])

  return useMemo(
    () => ({
      user,
      role: user?.role,
      isAuthenticated,
      isLoading,
      isFetching,
      isPending,
      isReady: !isPending,
      isError,
      refetchMe,
      clearAuth,
    }),
    [user, isAuthenticated, isLoading, isFetching, isPending, isError, refetchMe, clearAuth]
  )
}