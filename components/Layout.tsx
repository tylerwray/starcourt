import React from "react";
import { Home, LogOut, Settings } from "react-feather";
import NavItem from "./NavItem";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="bg-gray-300 h-full">
      <nav className="fixed left-0 w-12 h-full bg-gray-900 flex flex-col py-4">
        <NavItem to="/">
          <Home color="white" />
        </NavItem>
        <div className="flex-grow" />
        <NavItem to="/settings">
          <Settings color="white" />
        </NavItem>
        <NavItem to="/logout">
          <LogOut color="white" />
        </NavItem>
      </nav>
      <main className="ml-12 p-4">{children}</main>
    </div>
  );
};

export default Layout;
