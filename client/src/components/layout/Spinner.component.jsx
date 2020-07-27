import React from "react";

import logo from "../../img/6.gif";

function Spinner() {
   return (
      <img
         src={logo}
         alt="loading..."
         style={{
            margin: "auto",
            width: "40px",
            height: "40px",
            display: "block",
         }}
      />
   );
}
export default Spinner;
