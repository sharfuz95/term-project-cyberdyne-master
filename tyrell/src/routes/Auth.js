import React from "react";
import { gql, graphql } from "react-apollo";

const user = ({ id, name }) => <h1 key={id}>{name}</h1>;

const Auth = ({ data: { allUsers = [] } }) => <div>{allUsers.map(user)}</div>;

const query = gql`
  {
    allUsers {
      id
      name
    }
  }
`;

export default graphql(query)(Auth);
