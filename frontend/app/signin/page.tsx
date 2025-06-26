"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { login } from "@/lib/auth"
import { z } from "zod"

const signInSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login: authLogin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof SignInFormData, string>>
  >({})

  const redirectPath = searchParams.get("redirect") || "/profile"

  const validateForm = (): boolean => {
    try {
      signInSchema.parse({ email, password })
      setValidationErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof SignInFormData, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof SignInFormData] = err.message
          }
        })
        setValidationErrors(errors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await login({ email, password })

      // Store authentication data
      authLogin(response.user, response.access_token, response.refresh_token)

      // Redirect to the intended page or profile
      router.push(redirectPath)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Wystąpił nieznany błąd podczas logowania"
      )
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 bg-gradient-to-b from-blue-50 to-white">
        <div className="flex flex-col items-center justify-center w-full p-4 md:p-8">
          <div className="w-full max-w-md">
            <Card className="border shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-bold text-center">
                  Sign in to your account
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full ${
                        validationErrors.email ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`w-full ${
                        validationErrors.password ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white cursor-pointer"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        Loading....
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>
              </CardContent>

              <Separator className="my-2" />

              <CardFooter className="flex flex-col space-y-4 p-6 pt-2">
                <div className="text-center text-sm text-gray-600">
                  You dont have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-black hover:text-gray-800 hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
