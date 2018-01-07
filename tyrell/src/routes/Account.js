//Code taken from : https://github.com/ant-design/ant-design/edit/master/components/layout/demo/side.md

import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Tab from "../components/MyProfile/Tab";

import "./Account.css";

const styles = {
  paddingTop: "25px",
  paddingBottom: "50px"
};

class Account extends React.Component {
  constructor() {
    super();
  }

  render() {
    const title = "Welcome Sharfuz";

    return (
      <div>
        <Navbar />
        <div className="mybox">
          <Tab style={{ backgroundColor: "#ffffff", color: "#ffffff" }} />
        </div>
      </div>
    );
  }
}

export default Account;
