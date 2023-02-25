import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
  defaultOptions: {
	query: {
	  fetchPolicy: 'no-cache',
	  errorPolicy: 'all',
	},
  }
});

export default client;
