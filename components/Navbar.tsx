import { Navbar, NavbarBrand, NavbarToggle } from "flowbite-react";
import Link from "next/link";

export default function AdminNavbar() {
  return (
    <Navbar className="mx-3 mt-3 flex min-h-18 flex-row items-center">
      <NavbarBrand as={Link} href="https://flowbite-react.com">
        {/* <Image
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
          height={32}
          width={32}
        /> */}
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          Jarvis Admin
        </span>
      </NavbarBrand>
      <NavbarToggle />
      {/* <NavbarCollapse>
        <DarkThemeToggle />
      </NavbarCollapse> */}
    </Navbar>
  );
}
