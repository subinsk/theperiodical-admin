"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Checkbox, InputField } from "@/components";
import {
  signInWithGithub,
  signInWithGoogle,
  signInWithEmail
} from "@/lib/supabase/actions/login";
import {createClient} from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function LoginView(): JSX.Element {
  // hooks
  const router = useRouter()
  
  // states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // functions
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const supabase = createClient()

     const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

     if(data.user){
      router.push('/dashboard')
     }
  };

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
          <div className="flex flex-col gap-2">
            <button
              className=" flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800 dark:text-white"
              type="button"
              onClick={() => signInWithGoogle()}
            >
              <div className="rounded-full text-xl">
                <FcGoogle />
              </div>
              <p className="text-sm font-medium text-navy-700 dark:text-white">
                Sign In with Google
              </p>
            </button>
            {/* <button
              className=" flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800 dark:text-white"
              type="button"
              onClick={() => signInWithGithub()}
            >
              <div className="rounded-full text-xl">
                <FaGithub />
              </div>
              <p className="text-sm font-medium text-navy-700 dark:text-white">
                Sign In with Github
              </p>
            </button> */}
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
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="mail@domain.com"
            type="text"
            value={email}
            variant="auth"
          />

          <InputField
            extra="mb-3"
            id="password"
            label="Password*"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="********"
            type="password"
            value={password}
            isPassword
            variant="auth"
          />

          {/* <div className="mb-4 flex items-center justify-between px-2">
            <div className="mt-2 flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Keep me logged In
              </p>
            </div>
            <a
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              href=" "
            >
              Forgot Password?
            </a>
          </div> */}
          <button
            className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </div>
    </form>
  );
}
