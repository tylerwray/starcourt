import { NextPage } from "next";
import { redirect } from "../lib/utils";
import { parseCookies } from "nookies";
import Link from "next/link";

const Index: NextPage = () => (
  <>
    <p>You're in!</p>
    <Link href="/reset-password">
      <a>Reset password</a>
    </Link>
  </>
);

Index.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);

  if (!token) {
    redirect(ctx, "/login");
  }

  return {};
};

export default Index;
