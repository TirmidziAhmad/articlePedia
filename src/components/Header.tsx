import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  const isArticlesPage = pathname === "/articles";
  // const isArticleDetailPage =
  //   pathname?.startsWith("/articles/") && pathname.split("/").length > 2;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
    }
  }, []);

  const firstInitial = username ? username.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const logoStyles = !isArticlesPage ? "" : "md:invert md:brightness-0";

  const usernameStyles = !isArticlesPage
    ? "font-medium hidden md:inline text-black underline"
    : "font-medium hidden md:inline text-white underline";

  const headerClassName = !isArticlesPage
    ? "top-0 left-0 w-full bg-white border-b transition-colors"
    : "absolute top-0 left-0 w-full bg-white md:bg-transparent border-b md:border-none transition-colors z-50";

  return (
    <header className={headerClassName}>
      <nav className="flex items-center justify-between px-4 md:px-10 h-16">
        {/* Logo Left */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className={logoStyles}
            priority
          />
        </div>

        {/* Avatar Right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-7 w-7">
                <AvatarImage src="" alt="User" />
                <AvatarFallback>{username ? firstInitial : "?"}</AvatarFallback>
              </Avatar>
              {username && <span className={usernameStyles}>{username}</span>}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => router.push("/account")}>
              My Account
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={handleLogout}
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
