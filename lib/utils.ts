import { NextPageContext } from "next";
import Router from "next/router";

export function redirect(ctx: NextPageContext, target: string) {
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: target });
    ctx.res.end();
  } else {
    Router.push(target);
  }
}
