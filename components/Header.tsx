import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <nav className="max-w-5xl m-auto w-full px-4">
      <div className="flex items-center py-2 gap-8 justify-between">
        <Link className="text-xl font-bold" href={"/"}>
          LOGO
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/#features"
            className="font-medium text-sm text-black hover:opacity-90">
            Features
          </Link>

          <Link
            href="/#pricing"
            className="font-medium text-sm text-black hover:opacity-90">
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="font-medium text-sm text-white bg-black rounded-lg px-4 py-2 hover:opacity-90">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
