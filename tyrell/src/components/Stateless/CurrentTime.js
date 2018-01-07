import React, { Component } from "react";
import Moment from "react-moment";
import "moment-timezone";

const format = "D MMM YYYY kk:mm:ss.SSS";
const utc = "UTC";
const ny = "America/New_York";

class Zulu extends Component {
  render() {
    return <Moment interval={1} format={format} tz={utc} />;
  }
}

class Eastern extends Component {
  render() {
    return <Moment interval={1} format={format} tz={ny} />;
  }
}

export { Zulu, Eastern };
