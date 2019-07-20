import { ReactNode } from "react";
import { NextPage } from "next";

interface Props {
  children: ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => (
  <main className="w-full h-full">{children}</main>
);

export default Layout;
