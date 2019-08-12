import { NextPageContext } from "next";
import Router from "next/router";
import atob from "atob";

export function redirect(ctx: NextPageContext, target: string) {
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: target });
    ctx.res.end();
  } else {
    Router.push(target);
  }
}

export function isValidToken(token) {
  if (!token) return false;

  const payload: { exp: number } = JSON.parse(atob(token.split(".")[1]));

  const exp = new Date(payload.exp * 1000).getTime();

  if (exp >= Date.now()) {
    return true;
  }

  return false;
}
