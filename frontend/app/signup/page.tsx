"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { register } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"

const signUpSchema = z
  .object({
    email: z.string().email("Email is invalid"),
    first_name: z.string().min(2, "First name must be at least 2 characters long"),
    last_name: z.string().min(2, "Last name must be at least 2 characters long"),
    phone_number: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    password2: z.string(),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  })

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUp() {
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    password2: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({})

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    try {
      signUpSchema.parse(formData)
      setValidationErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof SignUpFormData, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof SignUpFormData] = err.message
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
      // Generate username from email and set role as guest
      const username = formData.email.split('@')[0]
      
      const response = await register({
        ...formData,
        username,
        role: "guest",
      })

      // Store authentication data
      authLogin(response.user, response.access_token, response.refresh_token)

      // Show success message
      toast({
        title: "Registration successful!",
        description: "Welcome to Dream Book. You can now explore and book amazing stays.",
      })

      // Redirect to profile
      router.push("/profile")
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "An unknown error occurred during registration"
      setError(errorMessage)
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      })
      console.error("Registration error", err)
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
                  Create an account
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        required
                        className={`w-full ${
                          validationErrors.first_name ? "border-red-500" : ""
                        }`}
                      />
                      {validationErrors.first_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.first_name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        required
                        className={`w-full ${
                          validationErrors.last_name ? "border-red-500" : ""
                        }`}
                      />
                      {validationErrors.last_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.last_name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
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
                    <Label htmlFor="phone_number">Phone Number (Optional)</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange("phone_number", e.target.value)}
                      className={`w-full ${
                        validationErrors.phone_number ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.phone_number && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.phone_number}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="password2">Confirm Password</Label>
                    <Input
                      id="password2"
                      type="password"
                      value={formData.password2}
                      onChange={(e) => handleInputChange("password2", e.target.value)}
                      required
                      className={`w-full ${
                        validationErrors.password2 ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.password2 && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.password2}
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
                      "Sign up"
                    )}
                  </Button>
                </form>
              </CardContent>

              <Separator className="my-2" />

              <CardFooter className="flex flex-col space-y-4 p-6 pt-2">
                <div className="text-center text-sm text-gray-600">
                  You already have an account?{" "}
                  <Link
                    href="/signin"
                    className="font-medium text-black hover:text-gray-800 hover:underline"
                  >
                    Sign in
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
