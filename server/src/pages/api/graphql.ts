import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import { resolvers } from "../../resolvers";

const typeDefs = gql`
  type Bottle {
    _id: String
    title: String
    price: Float
    website: String
    link: String
  }

  enum SortDir {
    asc
    desc
  }

  type Query {
    bottles(
      skip: Int
      limit: Int
      search: String
      sortKey: String
      sortDir: SortDir
    ): [Bottle]
    countBottles(search: String): Int
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export default startServerAndCreateNextHandler(server);
