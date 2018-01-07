import React from "react";
import { gql, graphql } from "react-apollo";
import { Form, Input, Button, Radio } from "antd";
import Bio from "./Bio";
import "./Personal.css";

class Personal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myBio: ""
    };

    this.doSetBio = this.doSetBio.bind(this);
  }

  handleChange(event) {}

  handleSubmit(event) {
    alert("on submit");
  }

  changeName(Name) {
    this.setState({ Name });
  }

  componentWillMount() {
    const name_find = graphql(queryname)(Personal);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.loading !== null) {
      this.doSetBio(nextProps.data.me.bio);
    }
  }

  doSetBio(newText) {
    this.setState({
      myBio: newText
    });
  }

  render() {
    var name = "";
    if (this.props.data.me != null) {
      name = this.props.data.me.name;
    }

    var email = "";
    if (this.props.data.me != null) {
      email = this.props.data.me.email;
    }

    return (
      <div>
        <div>
          <h1 className="one">Welcome {name}</h1>
        </div>

        <div>
          <h5 className="current-wrap" style={{ color: "#ffffff" }}>
            {" "}
            Current Information
          </h5>

          <ul className="list">
            <li>Email : {email}</li>
            <li>Bio: {this.state.myBio}</li>
          </ul>
        </div>

        <div>
          <Bio setBio={this.doSetBio} />
        </div>
      </div>
    );
  }
}

const queryname = gql`
  query {
    me {
      name
      email
      bio
    }
  }
`;

export default graphql(queryname)(Personal);
