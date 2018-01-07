import React from "react";

import "./NavbarLogo.css";

export default () => (
  <div className="ellipses-container">
    <h2 className="greeting">Cyberdyne</h2>
    <div className="ellipses ellipses__outer--thin">
      <div className="ellipses ellipses__orbit" />
    </div>
    <div className="ellipses ellipses__outer--thick" />
  </div>
);
