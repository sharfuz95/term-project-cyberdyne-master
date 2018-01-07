import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Auth from "./Auth";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import PageNotFound from "../components/404/404";
import LandingPage from "../components/LandingPage/LandingPage";
import checkAuth from "../utils/Auth";
import Account from "./Account";

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      checkAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/login" }} />
      )}
  />
);

// The last <Route> has path '*', which React Router matches to any route not matched to those declare above it
export default () => (
  <Switch>
    <Route exact path="/" component={LandingPage} />
    <Route exact path="/login" render={props => <Login {...props} />} />
    <Route exact path="/register" render={props => <Register {...props} />} />
    <AuthRoute exact path="/dashboard" component={Dashboard} />} />
    <AuthRoute exact path="/auth" component={Auth} />
    <AuthRoute exact path="/account" component={Account} />
    <Route path="*" component={PageNotFound} />
  </Switch>
);
//
