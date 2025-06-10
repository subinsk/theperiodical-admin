"use client"

import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { InputField } from "@/components"
import type { FormEvent, ChangeEvent } from "react"

export default function LoginView(): JSX.Element {
  // hooks
  const router = useRouter()

  // states
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  // functions
  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else if (result?.ok) {
        // Get the session to ensure user is authenticated
        const session = await getSession()
        if (session) {
          router.push("/dashboard")
          router.refresh()
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async (): Promise<void> => {
    setError("")
    setIsLoading(true)

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      })
    } catch (err) {
      setError("Google sign-in failed. Please try again.")
      console.error("Google sign-in error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
    if (error) setError("") // Clear error when user starts typing
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value)
    if (error) setError("") // Clear error when user starts typing
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-8 mt-8 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
        <div className="mt-[6vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
          <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Sign In
          </h3>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Sign In with Google or Email
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed dark:bg-navy-800 dark:text-white"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <div className="rounded-full text-xl">
                <FcGoogle />
              </div>
              <p className="text-sm font-medium text-navy-700 dark:text-white">
                {isLoading ? "Signing in..." : "Sign In with Google"}
              </p>
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
            <p className="text-base text-gray-600"> or </p>
            <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
          </div>

          <InputField
            extra="mb-3"
            id="email"
            label="Email*"
            onChange={handleEmailChange}
            placeholder="mail@domain.com"
            type="email"
            value={email}
            variant="auth"
            disabled={isLoading}
          />

          <InputField
            extra="mb-3"
            id="password"
            label="Password*"
            onChange={handlePasswordChange}
            placeholder="********"
            type="password"
            value={password}
            isPassword
            variant="auth"
            disabled={isLoading}
          />

          <button
            className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    </form>
  )
}