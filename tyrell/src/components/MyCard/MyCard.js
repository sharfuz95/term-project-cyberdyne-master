/* eslint-disable no-unused-vars */

import React from "react";
import { Card, Icon, Modal, message, Steps, Progress, Table } from "antd";
import { gql, graphql, compose } from "react-apollo";
import "./MyCard.css";

export const { Meta } = Card;

const Feed = require("rss-to-json");
const parseString = require("xml2js").parseString;

const tableColumns = [
  { title: "Type", dataIndex: "type", key: "type" },
  { title: "Info", dataIndex: "info", key: "info" }
];

// old template image: "https://tinyurl.com/yd89tr98"
class MyCard extends React.Component {
  state = {
    modBetVisible: false,
    modAddVisible: false,
    nflTeams: [],
    allWeekTeams: [],
    rawData: [],
    week: -1,
    gameDate: "",
    remainDays: 0,
    isWinState: 0
  };

  componentWillMount() {
    this.setState({
      isWinState: this.props.isWin
    });
    this.loadTeams(this, "2017", "REG", this.props.betWeek);
  }

  componentDidMount() {
    window.map = this; // for calling demo hack method
  }

  showAddModal = () => {
    this.loadTeams(this, "2017", "REG", this.refs.week);
    this.setState({
      modAddVisible: true
    });
  };
  handleAddOk = e => {
    this.setState({
      modAddVisible: false
    });
    const betAmount = this.refs.betAmount;
    const weekNum = this.refs.week;
    const betTeam = this.refs.betTeam;

    if (betTeam.options[betTeam.selectedIndex] != null) {
      const betTeamSelected = betTeam.options[betTeam.selectedIndex].value;

      if (betTeamSelected !== "") {
        const amountText = parseFloat(
          betAmount.options[betAmount.selectedIndex].value
        );
        if (this.props.addBet != null) {
          try {
            this.props
              .mutationAdd({
                variables: {
                  wager: amountText,
                  week: weekNum.options[weekNum.selectedIndex].value,
                  teamBet: betTeamSelected,
                  isWin: this.props.isWin
                }
              })
              .then(({ data }) => {
                this.props.addBet(
                  data.addBet.id,
                  data.addBet.wager,
                  data.addBet.week,
                  data.addBet.teamBet,
                  data.addBet.isWin
                );
                weekNum.value = 1;
              });
          } catch (e) {
            console.log(e);
          }
        }
        this.resetDialog();
        return;
      }
      this.resetDialog();
      message.error("No team selected.  Bet not placed.");
    }
  };
  handleAddCancel = e => {
    this.setState({
      modAddVisible: false
    });
    this.resetDialog();
  };

  resetDialog() {
    const weekNum = this.refs.week;
    weekNum.value = 1;
    this.setState({
      nflTeams: []
    });
  }

  showBetModal = () => {
    // this.loadTeams(this, "2017", "REG", this.props.betWeek);
    this.setState({
      modBetVisible: true
    });
  };

  handleBetClose = e => {
    this.setState({
      modBetVisible: false
    });
  };
  handleBetDelete = e => {
    this.setState({
      modBetVisible: false
    });
    if (this.props.removeBet != null) {
      try {
        this.props
          .mutationRemove({
            variables: {
              id: this.props.id
            }
          })
          .then(({ data }) => {
            this.props.removeBet(this);
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  loadTeams(mythis, season, type, week) {
    // example: http://www.nfl.com/ajax/scorestrip?season=2017&seasonType=REG&week=13
    //console.log("Fetching...");

    fetch(
      "http://www.nfl.com/ajax/scorestrip?season=" +
        season +
        "&seasonType=" +
        type +
        "&week=" +
        week
    )
      .then(response => response.text())
      .then(response => {
        parseString(response, function(err, result) {
          if (
            result.ss.gms != null &&
            result.ss.gms[0].g[0]["$"].hs != null &&
            result.ss.gms[0].g[0]["$"].vs != null
          ) {
            const gms = result.ss.gms[0];
            const teamNames = mythis.getTeamNames(gms);
            const gameDate = mythis.getGameDate(gms);
            const remainDays = mythis.getRemainDays(gameDate);
            mythis.setState({
              nflTeams: teamNames,
              rawData: gms.g,
              week: week,
              gameDate: gameDate,
              remainDays: remainDays
            });
            mythis.checkScores();
            return result.ss.gms[0];
          } else if (week + 1 <= 17) {
            return null; // pre and post season games can be added pretty easily
          } else {
            //mythis.loadTeams(mythis, season, type, week + 1);
          }
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  getTeamNames(json_data) {
    const teamNames = [];
    const allTeamNames = [];
    if (json_data != null) {
      for (let i = 0; i < json_data.g.length; i++) {
        const temp = json_data.g[i]["$"];
        if (temp.hs === null || temp.hs === "") {
          teamNames.push(
            temp.h +
              " vs " +
              temp.v +
              " (" +
              temp.hnn +
              " v. " +
              temp.vnn +
              " )"
          );
        }
        allTeamNames.push(
          temp.h + " vs " + temp.v + " (" + temp.hnn + " v. " + temp.vnn + " )"
        );
      }
      this.setState({
        modAddVisible: true,
        nflTeams: teamNames,
        allWeekTeams: allTeamNames
      });
    }
    return teamNames;
  }

  getGameDate(json_data) {
    const gameDate = "";
    if (json_data != null) {
      for (let i = 0; i < json_data.g.length; i++) {
        if (
          json_data.g[i]["$"].h === this.props.betTeam ||
          json_data.g[i]["$"].v === this.props.betTeam
        ) {
          let eid = json_data.g[i]["$"].eid;
          return eid.substr(4, 2) + "/" + eid.substr(6, 2) + "/" + "2017"; // 2017 hardcoded but could be updated
        }
      }
    }
  }

  getRemainDays(date) {
    var today = new Date();
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    var secondDate = new Date(
      2017,
      parseInt(date.substr(0, 2), 10),
      parseInt(date.substr(3, 2), 10)
    );
    var diffDays = Math.round(
      Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
    );

    return diffDays;
  }

  checkScores() {
    for (let i = 0; i < this.state.rawData.length; i++) {
      const field = this.state.rawData[i]["$"];
      if (field.h === this.props.betTeam || field.v === this.props.betTeam) {
        const isHome = field.h === this.props.betTeam;
        let homeScore = this.state.rawData[i]["$"].hs;
        let awayScore = this.state.rawData[i]["$"].vs;

        // 0 TBD, 1 LOSS, 2 WIN
        if (this.state.isWinState < 1) {
          if (homeScore !== "" || awayScore !== "") {
            homeScore = parseInt(homeScore, 10);
            awayScore = parseInt(awayScore, 10);
            if (isHome && homeScore > awayScore) {
              // winner
              this.setWinStatus(this.props.id, true);
            } else if (!isHome && awayScore > homeScore) {
              // winner
              this.setWinStatus(this.props.id, true);
            } else {
              // loser
              this.setWinStatus(this.props.id, false);
            }
          }
        }

        break;
      }
    }
  }

  handleWeekChange = e => {
    this.loadTeams(this, "2017", "REG", e.target.value);
  };

  handleTeamChange = e => {
    this.setState({}); // lazy way to re-render
  };

  setWinStatus(betId, isWinner) {
    // only including betID for hackability in demo
    // TODO: SET WIN IN DB
    // TODO: INCREMENT/DECREMENT WALLET
    const winNum = isWinner === true ? 2 : 1;

    if (this.props.id === betId) {
      this.setState({
        isWinState: winNum
      });

      try {
        this.props
          .mutationUpdateWin({
            variables: {
              isWin: winNum,
              id: this.props.id
            }
          })
          .then(({ data }) => {
            if (data.setWin != null) {
              console.log("Win updated for bet id: " + data.setWin.id);
              if (winNum == 1) {
                // loss
                this.props.mutationDebit({
                  variables: {
                    debit: this.props.betAmnt
                  }
                });
              } else if (winNum == 2) {
                this.props.mutationCredit({
                  variables: {
                    credit: this.props.betAmnt
                  }
                });
              }
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  render() {
    const teamsToHtml = [];
    for (let i = 0; i < this.state.nflTeams.length; i++) {
      const selectedTeam = this.state.nflTeams[i];
      teamsToHtml.push(
        <option key={selectedTeam} value={selectedTeam}>
          {selectedTeam}
        </option>
      );
    }
    let warning_text = "";
    if (teamsToHtml.length === 0) {
      warning_text = "All teams for this week have already played!";
    }
    const teamsSelectedToHtml = [];
    const teams = this.refs.teams;
    if (teams != null) {
      const team1 = teams.value.split(" ")[0];
      const team2 = teams.value.split(" ")[2];
      teamsSelectedToHtml.push(
        <option key="team1" value={team1}>
          {team1}
        </option>
      );
      teamsSelectedToHtml.push(
        <option key="team2" value={team2}>
          {team2}
        </option>
      );
    }

    if (this.props.cardType === "add") {
      return (
        <div
          className="box"
          style={{
            width: "250px",
            margin: "auto"
          }}
        >
          <Card
            style={{ backgroundColor: "#4C5770" }}
            bodyStyle={{ padding: 0 }}
            onClick={this.showAddModal}
          >
            <Icon
              style={{
                fontSize: 250,
                color: "#42f459"
              }}
              type="plus"
            />
            <Modal
              title="Add Bet"
              wrapClassName="vertical-center-modal"
              visible={this.state.modAddVisible}
              okText="Add"
              cancelText="Cancel"
              onOk={this.handleAddOk}
              onCancel={this.handleAddCancel}
            >
              <h1>
                Week:{" "}
                <select
                  defaultValue="1"
                  onChange={this.handleWeekChange}
                  ref="week"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                </select>
              </h1>
              <br />
              <h1>
                Teams:{" "}
                <select ref="teams" onChange={this.handleTeamChange}>
                  {teamsToHtml}
                </select>
              </h1>
              {warning_text}
              <br />
              <h1>
                Place Bet On:{" "}
                <select ref="betTeam">{teamsSelectedToHtml}</select>
              </h1>
              <br />
              <h1>
                Bet amount:{" "}
                <select id="betAmount" ref="betAmount">
                  <option value="50">$50</option>
                  <option value="100">$100</option>
                  <option value="150">$150</option>
                  <option value="200">$200</option>
                </select>
              </h1>
            </Modal>
          </Card>
        </div>
      );
    } else if (this.props.cardType === "bet") {
      let teamsText = "";
      let playDate = "";
      for (let i = 0; i < this.state.allWeekTeams.length; i++) {
        const splitTeams = this.state.allWeekTeams[i].split(" ");
        if (
          splitTeams[0] === this.props.betTeam ||
          splitTeams[2] === this.props.betTeam
        ) {
          teamsText = this.state.allWeekTeams[i];
          break;
        }
      }

      for (let i = 0; i < this.state.rawData.length; i++) {
        const field = this.state.rawData[i]["$"];
        if (field.h === this.props.betTeam || field.v === this.props.betTeam) {
          playDate =
            "Week " + this.state.week + " - " + field.d + " @ " + field.t;
        }
      }

      let cardColor = "#f7ff93";
      let status = "Waiting for game to complete.";
      if (this.state.isWinState === 2) {
        cardColor = "#51ff4f";
        status = "Win";
      } else if (this.state.isWinState === 1) {
        cardColor = "#ff4242";
        status = "Lose";
      } else {
        cardColor = "#f7ff93";
      }

      const timeProg = this.state.isWinState > 0 ? 2 : 1;
      const timeDays = this.state.isWinState > 0 ? 0 : this.state.remainDays;
      const tableData = [
        { key: "1", type: "Status", info: status },
        { key: "2", type: "Team Bet", info: this.props.betTeam },
        { key: "3", type: "Bet Amount", info: "$" + this.props.betAmnt },
        {
          key: "4",
          type: "Game Day",
          info: this.state.gameDate + " (" + timeDays + " days remaining)"
        }
      ];

      return (
        <div className="box" style={{ width: "250px", margin: "auto" }}>
          <Card
            style={{ backgroundColor: cardColor }}
            bodyStyle={{ padding: 0 }}
            onClick={this.showBetModal}
          >
            <div className="custom-image">
              <h2 style={{ textAlign: "center" }}>{playDate}</h2>
              <img
                alt="bet-img"
                width="100%"
                height="100%"
                style={{ backgroundSize: "cover", height: "100%" }}
                src={
                  "https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/" +
                  this.props.betTeam +
                  ".svg"
                } //this.state.imgUrl} //https://tinyurl.com/y7yed5jc"
              />
            </div>
            <div className="custom-card">
              <h3 style={{ textAlign: "center" }}>{teamsText}</h3>
              <p style={{ textAlign: "center" }}>
                Bet placed: {this.props.betTeam} (ID: {this.props.id})
              </p>
            </div>
            <Modal
              title="View Bet"
              wrapClassName="vertical-center-modal"
              visible={this.state.modBetVisible}
              okText="Delete"
              cancelText="Close"
              onOk={this.handleBetDelete}
              onCancel={this.handleBetClose}
            >
              <div style={{ margin: "auto", textAlign: "center" }}>
                <Progress
                  type="circle"
                  percent={100 - 5 * timeDays}
                  format={percent => timeDays + " Days"}
                />
              </div>
              <br />
              <Steps current={timeProg}>
                <Steps.Step title="Bet Placed" description="Finished!" />
                <Steps.Step
                  title="Game Day"
                  description={playDate.substr(playDate.indexOf("-") + 2)}
                />
                <Steps.Step
                  title="Game Results"
                  description={status.substr(0, 7)}
                />
              </Steps>
              <br />
              <br />
              <Table columns={tableColumns} dataSource={tableData} />
            </Modal>
          </Card>
        </div>
      );
    }
  }
}

MyCard.defaultProps = {
  cardType: "bet",
  addBet: null,
  removeBet: null,
  betAmnt: 100,
  betTeam: "PIT",
  week: 1,
  isWin: 0,
  id: -1
};

const mutationAdd = gql`
  mutation($wager: Float!, $week: String!, $teamBet: String!, $isWin: Int!) {
    addBet(wager: $wager, week: $week, teamBet: $teamBet, isWin: $isWin) {
      wager
      week
      teamBet
      isWin
      id
    }
  }
`;

const mutationRemove = gql`
  mutation($id: Int!) {
    removeBet(id: $id) {
      id
    }
  }
`;

const mutationUpdateWin = gql`
  mutation($isWin: Int!, $id: Int!) {
    setWin(isWin: $isWin, id: $id) {
      id
    }
  }
`;

const mutationCredit = gql`
  mutation($credit: Int!) {
    credit(credit: $credit) {
      balance
    }
  }
`;

const mutationDebit = gql`
  mutation($debit: Int!) {
    debit(debit: $debit) {
      balance
    }
  }
`;

export default compose(
  graphql(mutationAdd, { name: "mutationAdd" }),
  graphql(mutationRemove, { name: "mutationRemove" }),
  graphql(mutationUpdateWin, { name: "mutationUpdateWin" }),
  graphql(mutationCredit, { name: "mutationCredit" }),
  graphql(mutationDebit, { name: "mutationDebit" })
)(MyCard);

//export default MyCard;//graphql(ComponentWithMutations)(MyCard);
