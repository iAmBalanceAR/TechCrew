"use client"

import { SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { createBrowserSupabaseClient } from "@/lib/supabase"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = isSignUp 
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              data: {
                first_name: firstName,
                last_name: lastName,
              }
            }
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          })

      if (error) {
        throw error
      }

      if (data.user) {
        if (isSignUp) {
          setError('Please check your email to confirm your account')
          setIsLoading(false)
          return
        }
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xs space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-white bg-red-500/10 border border-red-500 rounded">
            {error}
          </div>
        )}
        {isSignUp && (
          <>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setFirstName(e.target.value)}
                required={isSignUp}
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setLastName(e.target.value)}
                required={isSignUp}
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-400"
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setEmail(e.target.value)}
            required
            className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
            required
            className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-400"
          />
        </div>
        <Button 
          className="w-full bg-orange-600 hover:bg-orange-500 text-white" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {isSignUp ? 'Sign Up' : 'Log In'}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          {isSignUp 
            ? 'Already have an account? Log in' 
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}

