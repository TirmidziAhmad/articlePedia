"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      router.push("/user/articles");
    }
  }, [router]);

  return <>{children}</>;
}
