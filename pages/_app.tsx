import { ApolloProvider } from "@apollo/react-hooks";
import App, { Container } from "next/app";
import { client } from "../lib/apollo";
import "../style.css";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container className="w-full h-full">
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default MyApp;
