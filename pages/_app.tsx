import App, { Container } from "next/app";
import { ApolloProvider } from "@apollo/react-hooks";

import Layout from "../components/Layout";
import { client } from "../lib/apollo";

import "../style.css";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container className="w-full h-full">
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </Container>
    );
  }
}

export default MyApp;
