import { NextPage } from "next";
import { destroyCookie } from "nookies";
import { redirect } from "../lib/utils";

const Logout: NextPage = () => {
  return null;
};

Logout.getInitialProps = async ctx => {
  destroyCookie(ctx, "token");
  redirect(ctx, "/login");
  return {};
};

export default Logout;
