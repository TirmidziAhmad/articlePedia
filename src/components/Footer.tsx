import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className="w-full bg-[#4479EE] h-28 flex items-center justify-center text-white px-4">
        <div className="flex flex-col md:flex-row items-center gap-2 text-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="invert brightness-0"
          />
          <p className="text-sm">
            &copy; {currentYear} Blog GenZet. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
