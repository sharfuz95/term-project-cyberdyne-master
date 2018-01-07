import React from "react";

import { Auth } from "../utils/Auth";
import MyNavbar from "../components/Navbar/Navbar";
import MyCard from "../components/MyCard/MyCard";
import { gql, graphql } from "react-apollo";
import "./dashboard.css";

const styles = {
  paddingTop: "25px",
  paddingBottom: "300px"
};

class Dashboard extends React.Component {
  state = { content: [] };

  constructor(props) {
    super(props);

    this.addBet = this.addBet.bind(this);
    this.removeBet = this.removeBet.bind(this);
  }

  onSubmit = async () => {
    Auth.logout();
    this.setState({ redirect: true });
  };

  componentWillMount() {
    graphql(queryUpdate)(Dashboard);
  }

  addBet(bet_id, betAmount, week, betTm, winStat) {
    this.setState((prevState, props) => {
      return {
        content: prevState.content.concat(
          <MyCard
            betAmnt={betAmount}
            removeBet={this.removeBet}
            id={bet_id}
            betWeek={week}
            betTeam={betTm}
            isWin={winStat}
            key={bet_id}
          />
        ) // note: you MUST use concat since push mutates the orig
      };
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data != null && !nextProps.data.loading) {
      this.setState({ content: [] });
      let bets = nextProps.data.getUserBets;
      for (let i = 0; i < bets.length; i++) {
        this.addBet(
          bets[i].id,
          bets[i].wager,
          bets[i].week,
          bets[i].teamBet,
          bets[i].isWin
        );
      }
    }
  }
  removeBet(bet_to_remove) {
    this.setState((prevState, props) => {
      var temp = [];
      for (var i = 0; i < prevState.content.length; i++) {
        if (
          prevState.content[i] !== [] &&
          prevState.content[i].props.id !== bet_to_remove.props.id
        ) {
          temp = temp.concat(prevState.content[i]);
        }
      }
      return {
        content: temp
      };
    });
  }

  render() {
    return (
      <div>
        <MyNavbar />
        <div className="content_wrap">
          <div className="content_wrap2">
            <div className="row-wrapper" style={styles}>
              {this.state.content}
              <MyCard cardType="add" addBet={this.addBet} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const queryUpdate = gql`
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

export default graphql(queryUpdate)(Dashboard);
