import React from "react";
import { Button, Modal, Form, Input, Radio } from "antd";
import { gql, graphql } from "react-apollo";

const FormItem = Form.Item;

class Bio extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    visible: false,
    bio: ""
  };

  showModal = () => {
    this.setState({ visible: true });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    try {
      const bionew = this.props
        .mutationBio({
          variables: {
            bio: this.refs.bioText.value
          }
        })
        .then(({ data }) => {
          this.setState({ bio: this.refs.bioText.value });
          if (this.props.setBio != null) {
            this.props.setBio(this.state.bio);
          }
        });
    } catch (e) {
      console.log("error found:" + e);
    }
    this.setState({ visible: false });
  };

  saveFormRef = form => {
    this.form = form;
  };

  componentWillReceiveProps(newprops) {}

  render() {
    return (
      <div>
        <div>
          <Button type="primary" onClick={this.showModal}>
            Update Bio
          </Button>
          <Modal
            title="Update Bio"
            wrapClassName="vertical-center-modal"
            visible={this.state.visible}
            okText="Update"
            cancelText="Close"
            onOk={this.handleCreate}
            onCancel={this.handleCancel}
          >
            <h1>Enter new bio:</h1>
            <textarea ref="bioText" />
          </Modal>
        </div>
      </div>
    );
  }
}

const mutationBio = gql`
  mutation($bio: String!) {
    setBio(bio: $bio) {
      bio
    }
  }
`;

Bio.defaultProps = {
  setBio: null
};

export default graphql(mutationBio, { name: "mutationBio" })(Bio);
