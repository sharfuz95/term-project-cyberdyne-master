import React /*, { Component }*/ from "react";
import { Link } from "react-router-dom";

import "./404.css";

// class Canvas extends Component {
//   componentDidMount() {
//     const canvas = this.refs.canvas;
//     const ctx = canvas.getContext("2d");
//   }

//   render() {
//     return (
//       <div>
//         <canvas ref="canvas" width={900} height={600} />
//       </div>
//     );
//   }
// }

export default () => (
  <div className="container">
    <canvas id="msg" />
    <div className="glitch-container">
      <h1 className="glitch" data-text="404">
        404
      </h1>
      <p className="msg">
        you're attempting to access a resource that does not exist anymore
      </p>
      <ul className="link-list">
        <li className="link">
          <Link to="/">home</Link>
        </li>
        <li className="link">
          <Link to="/register">register</Link>
        </li>
      </ul>
    </div>
  </div>
);
