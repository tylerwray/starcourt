import { NextPage } from "next";
import { parseCookies } from "nookies";
import Layout from "../components/Layout";
import { redirect } from "../lib/utils";

const Index: NextPage = () => (
  <Layout>
    <h1>Budgets</h1>
  </Layout>
);

Index.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);

  if (!token) {
    redirect(ctx, "/login");
  }

  return {};
};

export default Index;
