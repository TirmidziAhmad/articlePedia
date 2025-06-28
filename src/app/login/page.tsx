"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import Image from "next/image";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(1, "Username field cannot be empty"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type FormData = z.infer<typeof formSchema>;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: login,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("login Data:", data);
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white md:bg-[#F3F4F6]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[400px] space-y-4 p-8 rounded-md bg-white"
      >
        {/* Logo */}
        <Image
          className="mx-auto"
          src={"/logo.png"}
          alt="logo"
          width={130}
          height={100}
        ></Image>

        {/* Username Input */}
        <div>
          <label className="block mb-2 font-medium text-gray-900">
            Username
          </label>
          <Input
            type="text"
            placeholder="Input Username"
            {...login("username")}
          />
          {errors.username && (
            <div className="text-sm text-red-500">
              {errors.username.message}
            </div>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block mb-2  font-medium text-gray-900">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Input Password"
              {...login("password")}
              className="pr-10"
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          {errors.password && (
            <div className="text-sm text-red-500">
              {errors.password.message}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="bg-[#2563EB] hover:bg-[#3b82f6]"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2Icon className="animate-spin mr-2" />
              loading
            </>
          ) : (
            "login"
          )}
        </Button>

        {/* Link to Login */}
        <div className="text-sm text-center">
          Don`t have an account?{" "}
          <Link href="/register" className="text-blue-500 underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
