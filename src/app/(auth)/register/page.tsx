"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["User", "Admin"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});

type FormData = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const checkUser = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users?username=${data.username}`
      );

      if (checkUser.data.length > 0) {
        toast.error("Username already exists");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        data
      );

      toast.success("Register successful!");
      console.log("Register Response:", response.data);
      router.push("/login");
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("Register failed!");
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
            {...register("username")}
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
              {...register("password")}
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

        {/* Dropdown Role */}
        <div>
          <label className="block mb-2 font-medium text-gray-900">Role</label>
          <div className="relative">
            <select
              {...register("role")}
              className="appearance-none px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm w-full"
              defaultValue=""
            >
              <option disabled value="">
                Select Role
              </option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {errors.role && (
            <div className="text-sm text-red-500">{errors.role.message}</div>
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
              Loading...
            </>
          ) : (
            "Register"
          )}
        </Button>

        {/* Link to Login */}
        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
