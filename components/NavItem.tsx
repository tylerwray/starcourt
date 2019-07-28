import Link from "next/link";
import React from "react";

interface Props {
  to: string;
}

const NavItem: React.FC<Props> = ({ to, children }) => {
  return (
    <Link href={to}>
      <a className="w-full h-10 flex justify-center items-center hover:bg-gray-800">
        {children}
      </a>
    </Link>
  );
};

export default NavItem;
