"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"], {
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
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // const checkUser = await axios.get(
      //   `${process.env.NEXT_PUBLIC_API_URL}/users?username=${data.username}`
      // );

      // const existingUser = checkUser.data.find(
      //   (user: { username: string }) => user.username === data.username
      // );

      // if (existingUser) {
      //   toast.error("Username already exists");
      //   setLoading(false);
      //   return;
      // }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, data);
      toast.success("Register successful!");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        toast.error(
          "Register failed: " + (error.response?.data || error.message)
        );
      } else {
        console.error("Unknown Error:", error);
        toast.error("An unexpected error occurred.");
      }
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
          <Select
            onValueChange={(value) => {
              // manually set value to react-hook-form
              setValue("role", value as "user" | "admin");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <div className="text-sm text-red-500 mt-1">
              {errors.role.message}
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
