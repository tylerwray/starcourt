import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from "apollo-boost";
import fetch from "isomorphic-unfetch";

const isBrowser = typeof window !== "undefined";

const authLink = new ApolloLink((operation, forward) => {
  const { token } = operation.getContext();

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: "https://wealthyment-api.herokuapp.com/graphql", // Server URL (must be absolute)
  credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
  // Use fetch() polyfill on the server
  fetch: !isBrowser && fetch
});

export const client = new ApolloClient({
  connectToDevTools: isBrowser,
  ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
