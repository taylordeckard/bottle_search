import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import { resolvers } from "../../resolvers";
import { websites } from '../../websites';

function websitesToGql () {
  let str = '';
  websites.forEach(w => {
    str += `${w}\n`;
  });
  return str;
}

const typeDefs = gql`
  enum Website {
    ${websitesToGql()}
  }

  type Bottle {
    _id: String
    title: String
    price: Float
    website: String
    link: String
    fresh: Boolean
  }

  enum SortDirection {
    asc
    desc
  }

  type Query {
    bottles(
      fresh: Boolean
      limit: Int
      rangeStart: Float
      rangeEnd: Float
      search: String
      skip: Int
      sortDirection: SortDirection
      sortColumn: String
      website: [Website]
    ): [Bottle]
    countBottles(
      fresh: Boolean
      search: String
      rangeStart: Float
      rangeEnd: Float
      website: [Website]
    ): Int
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export default startServerAndCreateNextHandler(server);
