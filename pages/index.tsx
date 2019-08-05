import { NextPage } from "next";
import { parseCookies } from "nookies";
import Layout from "../components/Layout";
import { redirect } from "../lib/utils";
import { client } from "../lib/apollo";
import gql from "graphql-tag";
import Button from "../components/Button";
import Account from "../components/Account";
import usePlaidClient from "../hooks/usePlaidClient";
import { IAccount } from "../models";

const Index: NextPage<{ accounts: IAccount[] }> = ({ accounts }) => {
  const { handler, loading } = usePlaidClient();

  if (loading) return null;

  function handleClick() {
    if (!handler) {
      alert("Still loading button");
      return;
    }

    handler.open();
  }

  return (
    <Layout>
      {accounts.length === 0 ? (
        <Button onClick={handleClick}>Link a new account</Button>
      ) : (
        <>
          <h1>Balances</h1>
          {accounts.map(account => (
            <Account key={account.id} account={account} />
          ))}
        </>
      )}
    </Layout>
  );
};

Index.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);

  if (!token) {
    redirect(ctx, "/login");
    return;
  }

  const { data } = await client.query<{ accounts: IAccount[] }>({
    query: gql`
      query Accounts {
        accounts {
          id
          name
          type
          subtype
          balances {
            available
            current
          }
        }
      }
    `,
    context: { token }
  });

  return { accounts: data.accounts };
};

export default Index;
