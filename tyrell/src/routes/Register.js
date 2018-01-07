import React from "react";
import { Row, Col, Form, Button, Input, Checkbox } from "antd";
import { gql, graphql, compose } from "react-apollo";
import { Redirect } from "react-router-dom";

import "./Login.css";

const styles = {
  paddingTop: "150px"
};

const inputStyles = {
  paddingTop: "5px",
  marginBottom: "5px"
};

class Register extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    isAdmin: false
  };

  onChange = e => {
    if (e.target.name === "isAdmin") {
      this.setState({
        [e.target.name]: e.target.checked
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };

  onSubmit() {
    /* const userResponse = this.props.mutationCreateUser({
      variables: this.state
    });
    const walletResponse = this.props.mutationCreateWallet({
      user_id: userResponse.id
    });*/
    try {
      this.props
        .mutationCreateUser({
          variables: {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            isAdmin: this.isAdmin
          }
        })
        .then(({ data }) => {
          /*this.props
            .mutationCreateWallet({
              variables: {}
            })
            .then(({ data }) => {
              console.log("register worked! " + "data.createWallet.balance");
              //console.log(userResponse);
              this.setState({ redirect: true });
            });*/
          console.log("Register worked! " + data.register.wallet);
          this.setState({ redirect: true });
        });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/dashboard" />;
    }
    return (
      <div className="content_wrap">
        <Row style={styles}>
          <Col span={8} offset={8}>
            <h1 className="log-title">Register</h1>
            <Form className="login-form">
              <Input
                name="name"
                style={inputStyles}
                placeholder="Name"
                onChange={e => this.onChange(e)}
                value={this.state.name}
              />
              <Input
                name="email"
                style={inputStyles}
                placeholder="Email"
                onChange={e => this.onChange(e)}
                value={this.state.email}
              />
              <Input
                name="password"
                style={inputStyles}
                placeholder="Password"
                type="password"
                onChange={e => this.onChange(e)}
                value={this.state.password}
              />
              <Checkbox
                name="isAdmin"
                style={inputStyles}
                checked={this.state.isAdmin}
                onChange={e => this.onChange(e)}
              >
                Admin?
              </Checkbox>
              <br />
              <Button
                onClick={() => this.onSubmit()}
                type="primary"
                className="login-form-button"
              >
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const mutationCreateUser = gql`
  mutation(
    $name: String!
    $email: String!
    $password: String!
    $isAdmin: Boolean
  ) {
    register(
      user: {
        name: $name
        email: $email
        password: $password
        isAdmin: $isAdmin
      }
    ) {
      id
    }
  }
`;

const mutationCreateWallet = gql`
  mutation {
    createWallet {
      balance
    }
  }
`;

export default compose(
  graphql(mutationCreateUser, { name: "mutationCreateUser" }),
  graphql(mutationCreateWallet, { name: "mutationCreateWallet" })
)(Register);
