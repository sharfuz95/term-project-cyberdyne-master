import React from "react";
import Particles from "react-particles-js";
import { Auth } from "../../utils/Auth";
import { Form, Button, Affix } from "antd";
import { gql, graphql } from "react-apollo";

// import NavbarLogo from "../NavbarLogo/NavbarLogo";
import "./Navbar.css";

const FormItem = Form.Item;

const params = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 1000
      }
    },
    color: {
      value: "#ffffff"
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000"
      },
      polygon: {
        nb_sides: 6
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 0.25,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: {
        enable: false,
        mode: "repulse"
      },
      onclick: {
        enable: false,
        mode: "repulse"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
};

const particleStyle = {
  position: "absolute",
  zIndex: 0,
  width: "100%",
  height: "80px"
};

const loginFormStyle = {
  paddingRight: "20px",
  paddingLeft: "15px",
  fontFamily: "Inconsolata, monospace"
};

const formItemStyle = {
  marginBottom: "0px"
};

class MyNavbar extends React.Component {
  state = { walletBalence: -1 };

  onSubmit = async () => {
    Auth.logout();
    //this.setState({ redirect: true });
  };

  componentWillMount() {
    this.props.data.startPolling(350);
    graphql(queryWallet)(MyNavbar);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data != null && !nextProps.data.loading) {
      let wallet = nextProps.data.myWallet;
      this.setState({ walletBalence: wallet.balance });
    }
  }

  render() {
    // NOTE: DON'T USE NAVLINK...must be done this way to fix glitch for now
    var isDash = "dispActive";
    var isAcc = "";
    if (window.location.href.includes("dashboard")) {
      isDash = "dispActive";
      isAcc = "";
    } else {
      isDash = "";
      isAcc = "dispActive";
    }
    return (
      <div>
        <Particles params={params} style={particleStyle} />
        <Affix>
          <nav className="nav-container">
            <div className="ellipses-container">
              <h2 className="greeting">Cyberdyne</h2>
              <div className="ellipses ellipses__outer--thin">
                <div className="ellipses ellipses__orbit" />
              </div>
              <div className="ellipses ellipses__outer--thick" />
            </div>
            <div className="nav-link-container">
              <ul className="nav-link-list">
                <li className="nav-link" style={{ color: "#80ff60" }}>
                  Balance: ${this.state.walletBalence}
                </li>
                <li className="nav-link">
                  <a href="/dashboard" className={isDash}>
                    Dashboard
                  </a>
                </li>
                <li className="nav-link">
                  <a href="/account" className={isAcc}>
                    Account
                  </a>
                </li>
                <Form
                  onSubmit={this.onSubmit}
                  className="login-form"
                  style={loginFormStyle}
                >
                  <FormItem style={formItemStyle}>
                    <Button type="danger" ghost htmlType="submit">
                      Log Out
                    </Button>
                  </FormItem>
                </Form>
              </ul>
            </div>
          </nav>
        </Affix>
      </div>
    );
  }
}

const queryWallet = gql`
  query {
    myWallet {
      balance
    }
  }
`;

export default graphql(queryWallet)(MyNavbar);
