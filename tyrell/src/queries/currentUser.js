import { gql, graphql } from "react-apollo";

export default gql`
  query {
    me {
      id
      name
      displayName
      email
    }
  }
`;
