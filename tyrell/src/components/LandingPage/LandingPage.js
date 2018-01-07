/* eslint-disable react/jsx-no-comment-textnodes */

import React from "react";

import { Zulu, Eastern } from "../Stateless/CurrentTime";
import "./LandingPage.css";
import { Link } from "react-router-dom";

const lat = "N 43° 7' 33.618\"";
const long = "W 77° 37' 48.1908\"";

/**
 * The default export of this file is a function which returns the React DOM nodes to be rendered. This is an
 * example of React's "stateless functional component" concept. That is, there are no props being passed to the
 * function, and no part of it relies on application state.
 *
 * Credit for the design from the following CodePen:
 * Author: Kevin Kanyingi - https://codepen.io/kkanyingi/
 * Title: Landing Page
 * URL: https://codepen.io/kkanyingi/pen/vLowwB?q=landing+page&limit=all&type=type-pens
 */
export default () => (
  <div className="container">
    <div className="container__item landing-page-container">
      <div className="content__wrapper">
        <p className="coords">
          {lat} &#47;&#47;&#47; {long}
          <br />
          <Zulu /> <span className="tz">Zulu</span> &#47;&#47;&#47; <Eastern />{" "}
          <span className="tz">EDT</span>
        </p>
        <div className="ellipses-container">
          <h2 className="greeting">Cyberdyne</h2>
          <div className="ellipses ellipses__outer--thin">
            <div className="ellipses ellipses__orbit" />
          </div>
          <div className="ellipses ellipses__outer--thick" />
        </div>
		<ul className="link-list">
			<li className="link">
			  <div className="wrapper">
				<Link to="/login" className="button">Login</Link>
			  </div>
			</li>
			<li className="link">
			  <div className = "wrapper2">
				<Link to="/register" className="button">Register</Link>
			  </div>
			</li>
        </ul>
      </div>
    </div>
  </div>
);
