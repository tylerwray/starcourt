import gql from "graphql-tag";
import { Plaid } from "plaid-link";
import { useEffect, useState } from "react";
import { client } from "../lib/apollo";
import { parseCookies } from "nookies";

let handler: Plaid.LinkHandler | null = null;

const LINK_BANK_ACCOUNT = gql`
  mutation linkAccount($publicToken: String!) {
    linkAccount(publicToken: $publicToken)
  }
`;

export default function usePlaidClient(): {
  handler: Plaid.LinkHandler | null;
  loading: boolean;
} {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const script = document.createElement("script");

    script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    script.async = true;

    script.onload = () => {
      handler = window.Plaid.create({
        clientName: "Personal balance viewer",
        env: "development",
        key: "56005877544b69429b9a90d834d399",
        product: ["auth", "transactions"],
        onSuccess: publicToken => {
          const { token } = parseCookies();
          client.mutate({
            mutation: LINK_BANK_ACCOUNT,
            variables: {
              publicToken
            },
            context: { token }
          });
        }
      });
      setLoading(false);
    };

    document.body.appendChild(script);
  }, [setLoading]);

  return { handler, loading };
}
