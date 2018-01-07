import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient, createNetworkInterface } from "react-apollo";

import "antd/dist/antd.css";

import App from "./App";

const networkInterface = createNetworkInterface({
  uri: "http://localhost:8080/graphql"
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      req.options.headers["x-token"] = localStorage.getItem("token");
      req.options.headers["x-refresh-token"] = localStorage.getItem(
        "refreshToken"
      );
      next();
    }
  }
]);

networkInterface.useAfter([
  {
    applyAfterware({ response: { headers } }, next) {
      const token = headers.get("x-token");
      const refreshToken = headers.get("x-refresh-token");
      if (token) {
        localStorage.setItem("token", token);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      next();
    }
  }
]);

const client = new ApolloClient({
  networkInterface: networkInterface
});

const AppRoot = () => (
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);

ReactDOM.render(<AppRoot />, document.getElementById("root"));
