"use client";
import { useRouter } from "next/navigation";

export default function UserHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    // Jika Anda menyimpan di cookies, hapus juga cookiesnya
    // document.cookie = 'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    alert("Anda telah logout.");
    router.push("/login"); // Redirect ke halaman login
  };

  return (
    <nav>
      {/* ... navigasi lainnya */}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
