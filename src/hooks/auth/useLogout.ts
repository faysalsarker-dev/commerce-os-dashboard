// features/auth/useLogout.ts
import { useCallback } from 'react'
import { toast } from 'sonner'
// import { authApi, useLogoutMutation } from '../../api/authApi'
import { useAppDispatch } from '@/redux/hooks'

export const useLogout = () => {
  const dispatch = useAppDispatch()
//   const [logoutMutation, { isLoading }] = useLogoutMutation()

  const logout = useCallback(async () => {
    try {
    //   await logoutMutation().unwrap()
      toast.success('Logged out successfully')
    } catch {
      // server call failed, but still clear local session
      toast.error('Logout request failed, session cleared locally')
    } finally {
    //   dispatch(authApi.util.resetApiState())
    }
  }, [
    // logoutMutation, dispatch

])

  return { logout, isLoading:false }
}