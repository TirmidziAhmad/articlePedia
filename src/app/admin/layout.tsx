"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Newspaper, Tags, LogOut, Menu } from "lucide-react"; // Removed LayoutDashboardIcon as it's not used
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import useRouter for client-side path access

// Define a type for your navigation items
type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType; // Use React.ElementType for component types
};

// Define your navigation items as an array of NavItem
const adminNavItems: NavItem[] = [
  {
    href: "/admin/articles",
    label: "Articles",
    icon: Newspaper,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: Tags,
  },
];

const mainNavItems: NavItem[] = [
  ...adminNavItems, // Re-use admin nav items
  {
    href: "/logout",
    label: "Logout",
    icon: LogOut,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current pathname

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Determine the current page title
  // Add a check for 'pathname' being defined before calling split()
  const currentPageTitle =
    pathname === "/admin"
      ? "Admin"
      : capitalizeFirstLetter(
          (pathname ? pathname.split("/").pop() : "") || "Admin"
        ); // Add a check for pathname before splitting

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Mobile Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block bg-blue-600">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center  px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center font-semibold">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="invert brightness-0"
              />
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary  text-white"
                >
                  <item.icon className="h-4 w-4 text-white " />
                  {item.label}
                </Link>
              ))}
              <Link
                href="/logout"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary mt-4 text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col ">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/admin" // Changed href from '#' to '/admin' for consistency
                  className="flex items-center text-lg font-semibold"
                >
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={52}
                    height={52}
                    className="h-8 w-8"
                  />
                </Link>
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">{currentPageTitle}</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
