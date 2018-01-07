// @flow

// We import the React namespace for Flow to have access to React's utility types
import * as React from "react";
import { Redirect, Link } from "react-router-dom";
import { Row, Col, Form, Icon, Button, Input } from "antd";
import { gql, graphql } from "react-apollo";
import { default as swal } from "sweetalert";

import checkAuth from "../utils/Auth";
import "./Login.css";

const FormItem = Form.Item;

// const FormItem = Form.Item;
const styles = {
  paddingTop: "150px"
};

const btnStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

// Flow type definition
type State = {
  email: string,
  password: string,
  redirect: boolean
};

class Login extends React.Component<State> {
  state = {
    email: "",
    password: "",
    redirect: false
  };

  componentWillMount() {
    if (checkAuth()) {
      this.setState({ redirect: true });
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleChange = value => {
    this.props.form.setFieldsValue({
      email: value,
      password: value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (err) console.log(`Error: ${err}`);
      if (!err) {
        console.log(`Values: ${values.email}, ${values.password}`);
        try {
          const response = await this.props.mutate({
            variables: {
              email: values.email,
              password: values.password
            }
          });
          const { token, refreshToken } = response.data.login;
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          console.log("login worked!");
          //browserHistory.push("/");

          this.setState({ redirect: true });
        } catch (e) {
          console.log("login failed!");
          swal("Error", "Invalid username or password", "error");
          console.log(e);
        }
      }
    });
    // this.props.history.push("/");      <------- this line breaks stuff
  };

  render() {
    //const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { getFieldDecorator } = this.props.form;

    if (this.state.redirect) {
      return <Redirect push to="/dashboard" />;
    }

    return (
      <div className="content_wrap">
        <Row style={styles}>
          <Col span={6} offset={9}>
            <h1 className="log-title">Login</h1>
            <Form onSubmit={this.onSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator("email", {
                  rules: [
                    { required: true, message: "Please input your email" }
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                    placeholder="Email"
                    onChange={this.handleChange.email}
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "Please input your password" }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                    type="password"
                    placeholder="Password"
                    onChange={this.handleChange.password}
                  />
                )}
              </FormItem>
              <FormItem style={btnStyles}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Log in
                </Button>
              </FormItem>
            </Form>
            <Link to="/register">or register now!</Link>
          </Col>
        </Row>
      </div>
    );
  }
}

const mutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
    }
  }
`;

const WrappedLoginForm = Form.create()(Login);

export default graphql(mutation)(WrappedLoginForm);
