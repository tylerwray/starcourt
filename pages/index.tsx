import { NextPage } from "next";
import { redirect } from "../lib/utils";

import "../style.css";

const Index: NextPage<void> = () => <p>Hello Next.js</p>;

Index.getInitialProps = async ctx => {
  redirect(ctx, "/login");
};

export default Index;
