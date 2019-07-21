import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import fetch from "isomorphic-unfetch";

const isBrowser = typeof window !== "undefined";

export const client = new ApolloClient({
  connectToDevTools: isBrowser,
  ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
  link: new HttpLink({
    uri: "http://localhost:4000/graphql", // Server URL (must be absolute)
    credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
    // Use fetch() polyfill on the server
    fetch: !isBrowser && fetch
  }),
  cache: new InMemoryCache()
});
