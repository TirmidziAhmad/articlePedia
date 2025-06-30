"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username field cannot be empty"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type FormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: login,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users?username=${data.username}`
      );

      const user = response.data[0];

      if (!user) {
        toast.error("Username not found");
        setLoading(false);
        return;
      }
      const userDetails = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`
      );

      if (userDetails.data.password !== data.password) {
        toast.error("Incorrect password");
      } else {
        localStorage.setItem("userId", user.id);
        localStorage.setItem("role", user.role);
        localStorage.setItem("password", user.password);
        localStorage.setItem("username", user.username);
        localStorage.setItem("isLoggedIn", "true");

        toast.success("Login successful!");
        if (user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/articles");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white md:bg-[#F3F4F6]">
      <Toaster />
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
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
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
