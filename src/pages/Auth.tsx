import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useLoginMutation } from '../hooks/useLoginMutation'
import { useSignupMutation } from '../hooks/useSignupMutation'
import Card from '../components/ui/Card'
import CardDescription from '../components/ui/CardDescription'
import CardHeader from '../components/ui/CardHeader'
import CardTitle from '../components/ui/CardTitle'
import IconListChecks from '../components/ui/IconListChecks'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'

const Auth: React.FC = () => {
  const { login, register } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const loginMutation = useLoginMutation()
  const signupMutation = useSignupMutation()

  const isLogin = useMemo(() => location.pathname !== '/register', [location.pathname])

  const toggleMode = () => {
    navigate(isLogin ? '/register' : '/login')
  }

  const handleLogin = async (payload: { email: string; password: string }) => {
    if (!payload.email || !payload.password) return
    try {
      await loginMutation.mutateAsync(payload)
      login()
      navigate('/dashboard')
    } catch {
      // Error shown via loginMutation.error
    }
  }

  const handleSignup = async (payload: { name: string; email: string; password: string }) => {
    if (!payload.name || !payload.email || !payload.password) return

    try {
      await signupMutation.mutateAsync(payload)
      register()
      navigate('/dashboard')
    } catch {
      // Error message is shown via signupMutation.error
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-4">
      <Card className="w-full max-w-md shadow-xl border border-cyan-100">
        <CardHeader className="space-y-1 text-center pb-6 mb-0">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-cyan-500 to-teal-500 p-3 rounded-2xl shadow-lg">
              <IconListChecks className="size-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            ChoreHub
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin ? 'Sign in to manage your cleaning events' : 'Create an account to get started'}
          </CardDescription>
        </CardHeader>

        <div className="px-6 pb-4">
          <div className="flex items-center justify-center gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => !isLogin && toggleMode()}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => isLogin && toggleMode()}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                !isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {isLogin ? (
          <LoginForm
            isLoading={loginMutation.isPending}
            errorMessage={loginMutation.isError ? (loginMutation.error instanceof Error ? loginMutation.error.message : 'Login failed') : undefined}
            onSubmit={handleLogin}
          />
        ) : (
          <SignupForm
            isLoading={signupMutation.isPending}
            errorMessage={signupMutation.isError ? (signupMutation.error instanceof Error ? signupMutation.error.message : 'Unable to create account') : undefined}
            onSubmit={handleSignup}
          />
        )}
      </Card>
    </div>
  )
}

export default Auth