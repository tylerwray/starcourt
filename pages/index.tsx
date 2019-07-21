import { NextPage } from "next";
import { redirect } from "../lib/utils";
import nookies from "nookies";

const Index: NextPage = () => <p>You're in!</p>;

Index.getInitialProps = async ctx => {
  const { token } = nookies.get(ctx);

  if (!token) {
    redirect(ctx, "/login");
  }

  return {}
};

export default Index;
