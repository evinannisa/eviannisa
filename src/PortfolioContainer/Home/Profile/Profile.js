/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useTypewriter } from "react-simple-typewriter";
import ScrollService from "../../../utilities/ScrollService";
import DribbleIcon from "../../../assets/Home/basketball-solid.svg";
import LinkedInIcon from "../../../assets/Home/linkedin.svg";
import InstagramIcon from "../../../assets/Home/instagram.svg";
import GithubIcon from "../../../assets/Home/github.svg";
import Resume from "../../../assets/Profile/Resume.pdf";
import "./Profile.css";

export default function Profile() {
   const [typeEffect] = useTypewriter({
      words: ["Front End Developer", "UI/UX Designer"],
      loop: {},
      typeSpeed: 100,
      deleteSpeed: 40,
   });

   return (
      <div className="profile-container">
         <div className="profile-parent">
            <div className="profile-details">
               <div className="colz">
                  <div className="colz-icon">
                     <a href="https://dribbble.com/Evi_annisa">
                        <img src={DribbleIcon} alt="" />
                     </a>
                     <a href="https://github.com/eviannisaa">
                        <img src={GithubIcon} alt="" />
                     </a>{" "}
                     <a href="https://www.linkedin.com/in/evinannisa/">
                        <img src={LinkedInIcon} alt="" />
                     </a>{" "}
                     <a href="https://www.instagram.com/eviannisa_">
                        <img src={InstagramIcon} alt="" />
                     </a>
                  </div>
               </div>
               <div className="profile-details-name">
                  <span className="primary-text">
                     Hello, I'm &nbsp;
                     <span className="highlighted-text">Evi Nur Annisa</span>
                  </span>
               </div>
               <div className="profile-details-role">
                  <span className="primary-text">
                     <h1>&nbsp;{typeEffect}</h1>
                     <span className="profile-role-tagline">
                        Expertise in Frontend Application Development and UI/UX
                        Design.
                     </span>
                  </span>
               </div>
               <div className="profile-options">
                  <button
                     className="btn primary-btn"
                     onClick={() =>
                        ScrollService.scrollHandler.scrollToHireMe()
                     }
                  >
                     Hire Me
                  </button>
                  <a href={Resume} download="Resume_Evi_Nur_Annisa.pdf">
                     <button className="btn highlighted-btn">Get Resume</button>
                  </a>
               </div>
            </div>
            <div className="profile-picture">
               <div className="profile-picture-background"></div>
            </div>
         </div>
      </div>
   );
}
