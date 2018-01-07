import React from "react";
import { gql, graphql } from "react-apollo";
import { Table, Icon, Divider } from "antd";
import "./History.css";

const styles = {
  paddingTop: "25px",
  paddingBottom: "50px",
  color: "blue"
};

const tableStyle = {
  paddingTop: "25px",
  paddingBottom: "50px"
};

const columndata = [
  {
    title: "Game ID",
    dataIndex: "game",
    key: "game"
  },

  {
    title: "Bet",
    dataIndex: "bet",
    key: "bet"
  },
  {
    title: "Week",
    dataIndex: "week",
    key: "week"
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount"
  },
  {
    title: "Results",
    dataIndex: "results",
    key: "results"
  }
];

class History extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    const history = graphql(queryHistory)(History);
  }

  render() {
    var t1 = "";
    var t2 = "";
    var t3 = "";
    var t4 = "";
    var t5 = "";
    var t6 = "";

    var tableData = [];

    if (this.props.data.getUserBets != null) {
      var temp = [];
      for (let i = 0; i < this.props.data.getUserBets.length; i++) {
        t1 = this.props.data.getUserBets[i].teamBet;
        t2 = this.props.data.getUserBets[i].week;
        t3 = "$" + this.props.data.getUserBets[i].wager;
        t4 = this.props.data.getUserBets[i].isWin;
        t5 = this.props.data.getUserBets[i].id;
        t6 = this.props.data.getUserBets[i].id;

        if (t4 == 0) {
          t4 = "Not Played yet";
        }

        if (t4 == 1) {
          t4 = "You Lost";
        }

        if (t4 == 2) {
          t4 = "You Won";
        }

        temp = {
          key: t5,
          game: t6,
          bet: t1,
          week: t2,
          amount: t3,
          results: t4
        };
        tableData.push(temp);
      }
    }

    return (
      <div>
        <div className="content_format">
          <header>
            <h1 className="row-wrap"> My History</h1>
          </header>
          <div style={styles}>
            <Table
              style={{ backgroundColor: "#c6dcef" }}
              columns={columndata}
              dataSource={tableData}
            />
          </div>
        </div>
      </div>
    );
  }
}

const queryHistory = gql`
  query {
    getUserBets {
      id
      wager
      week
      teamBet
      isWin
    }
  }
`;

export default graphql(queryHistory)(History);
