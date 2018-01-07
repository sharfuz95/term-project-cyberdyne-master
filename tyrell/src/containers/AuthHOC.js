// @flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { withRouter } from "react-router";

// Components
// import Loading from "./Loading";

// Queries
import CurrentUser from "../queries/currentUser";

export default protectedRouteComponent => {
  class AuthHOC extends Component {
    constructor(props, context) {
      super(props, context);
    }

    // Check if there is validated user logged
    isLoggedin = () => {
      return this.props.Authorization.user;
    };
  }
};
