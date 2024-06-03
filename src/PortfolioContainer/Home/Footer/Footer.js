import React from "react";
import "./Footer.css";
import BgFooter from "../../../assets/Home/shape-bg.png";

export default function Footer() {
   return (
      <div className="footer-container">
         <div className="footer-parent">
            <img src={BgFooter} alt="problem loading file" />
         </div>
      </div>
   );
}
