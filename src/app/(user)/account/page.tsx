"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function Account() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedPassword = localStorage.getItem("password") || "";
    const storedRole = localStorage.getItem("role") || "";

    setUsername(storedUsername);
    setPassword(storedPassword);
    setRole(storedRole);
  }, []);

  return (
    <div className="h-[75vh] flex flex-col items-center justify-center space-y-6">
      <div className="w-[368px] flex flex-col items-center space-y-4">
        <h1 className="text-xl font-bold">User Profile</h1>

        <Avatar className="w-16 h-16">
          <AvatarImage src="/avatar.png" alt="avatar" />
          <AvatarFallback>
            {username?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="w-full p-3 bg-slate-200 rounded-md text-sm">
          <strong>Username:</strong> {username}
        </div>
        <div className="w-full p-3 bg-slate-200 rounded-md text-sm">
          <strong>Password:</strong> {password}
        </div>
        <div className="w-full p-3 bg-slate-200 rounded-md text-sm">
          <strong>Role:</strong> {role}
        </div>

        <Link
          href="/articles"
          className="bg-blue-500 rounded-lg w-full py-2 text-center text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
