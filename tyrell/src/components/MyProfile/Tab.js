import React from "react";

//import "./Tab.css";
import Personal from "./Personal";
import History from "./History";
import "./Tab.scss";

import { Tabs, Radio } from "antd";

const TabPane = Tabs.TabPane;

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "top"
    };
  }
  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };
  render() {
    const { mode } = this.state;
    return (
      <div>
        <Radio.Group
          onChange={this.handleModeChange}
          value={mode}
          style={{ marginBottom: 10 }}
        />
        <Tabs
          style={{ color: "#ffffff" }}
          defaultActiveKey="1"
          tabPosition={mode}
        >
          <TabPane className="one" tab="Account info" key="1">
            <Personal />
            <div />
          </TabPane>
          <TabPane tab="Betting History" key="3">
            <div>
              <History />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Tab;
